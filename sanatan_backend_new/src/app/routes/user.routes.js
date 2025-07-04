const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const nodemailer = require("nodemailer");
const S3_CONFIG = require("../../admin/config/s3.config");
const crypto = require("crypto");
const User = require("../models/users/users");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const verifyJWT = require("../middleware/verifyjwt");
const ApiError = require("../utils/apierror");
const ApiResponse = require("../utils/apiresponse");
const asyncHandler = require("../utils/asyncHandler");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "618397698961-n0n3qpaom7ehd9lc2na4bd10d6qh8sfv.apps.googleusercontent.com"
);

// Route 1: Verify Google ID Token and create or fetch user
router.post(
  "/login/google",
  asyncHandler(async (req, res) => {
    const { idToken } = req.body;

    try {
      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience:
          "618397698961-n0n3qpaom7ehd9lc2na4bd10d6qh8sfv.apps.googleusercontent.com",
      });
      const payload = ticket.getPayload();

      // Fetch or create user in your database
      let user = await User.findOne({ email: payload.email });
      if (!user) {
        throw new ApiError(404, "User does not exist");
      }
      const { accessToken, refreshToken } =
        await generateAccessAndRefereshTokens(user._id);

      const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
      );

      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            200,
            {
              user: loggedInUser,
              accessToken,
              refreshToken,
            },
            "User logged In Successfully"
          )
        );
    } catch (error) {
      console.error("Error during Google authentication:", error);
      res.status(403).json({ message: "Authentication failed" });
    }
  })
);

const s3 = new S3Client({
  region: S3_CONFIG.REGION,
  credentials: {
    accessKeyId: S3_CONFIG.ACCESS_KEY_ID,
    secretAccessKey: S3_CONFIG.SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: S3_CONFIG.BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const mimetype = file.mimetype.split("/");
      const ext = `.${mimetype[1]}`;

      const fullPath = `uploads/${uniqueSuffix}${ext}`;
      cb(null, fullPath);
    },
  }),
});
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./files/user");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
// const upload = multer({ storage: storage });

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Route 2: Generate OTP and send email
const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const otpExpires = new Date(Date.now() + 15 * 60000); // OTP valid for 15 minutes

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, otp, otpExpires });
    } else {
      user.otp = otp;
      user.otpExpires = otpExpires;
    }
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Here is your OTP",
      text: `Your OTP code is ${otp}. It is valid only for 15 minutes. -Sanatan Dharmaya`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("OTP sent to your email.");
  } catch (error) {
    res.status(500).send("Error sending OTP.");
  }
});

// Route 3: Verify OTP and generate JWT
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).send("Invalid OTP!!");
    }

    if (new Date() > user.otpExpires) {
      return res.status(400).send("OTP has expired.");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "OTP Verification Success"
        )
      );
  } catch (error) {
    res.status(500).send("Error verifying OTP.");
  }
});

// Route 4: Register User
// const registerUser = asyncHandler(async (req, res) => {
//   const { fullName, email, username, phone, password } = req.body;
//   //console.log("email: ", email);

//   if (
//     [fullName, email, username, password, phone].some(
//       (field) => field?.trim() === ""
//     )
//   ) {
//     throw new ApiError(400, "All fields are required");
//   }

//   const existedUser = await User.findOne({
//     $or: [{ email }, { phone }],
//   });

//   if (existedUser) {
//     throw new ApiError(409, "User already exists");
//   }
//   //console.log(req.files);
//   const existedUsername = await User.findOne({
//     username,
//   });

//   if (existedUsername) {
//     const userCount = await User.countDocuments();
//     const serialNumber = userCount + 1;
//     const newUsername = `${username.toLowerCase()}-${serialNumber}`;
//     const user = await User.create({
//       fullName: fullName,
//       userPic: "",
//       userId: `SD${serialNumber}`,
//       email: email,
//       phone: phone,
//       password: password,
//       username: newUsername.toString(),
//       gender: "",
//     });
//     const createdUser = await User.findById(user._id).select(
//       "-password -refreshToken"
//     );

//     if (!createdUser) {
//       throw new ApiError(
//         500,
//         "Something went wrong while registering the user"
//       );
//     }

//     return res
//       .status(200)
//       .json(new ApiResponse(200, createdUser, "User registered Successfully"));
//   }
//   const userCount = await User.countDocuments();
//   const serialNumber = userCount + 1;
//   const user = await User.create({
//     fullName: fullName,
//     userPic: "",
//     userId: `SD${serialNumber}`,
//     email: email,
//     phone: phone,
//     password: password,
//     username: username,
//     gender: "",
//   });

//   const createdUser = await User.findById(user._id).select(
//     "-password -refreshToken"
//   );

//   if (!createdUser) {
//     throw new ApiError(500, "Something went wrong while registering the user");
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, createdUser, "User registered Successfully"));
// });

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, phone, password } = req.body;

  if (![fullName, email, username, phone, password].every(Boolean)) {
    throw new ApiError(400, "All fields are required");
  }

  const userPic = req.file ? req.file.location : "";

  const existedUser = await User.findOne({ $or: [{ email }, { phone }] });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const existedUsername = await User.findOne({ username });
  const randomNumber = Math.floor(1000 + Math.random() * 90000);
  const finalUsername = existedUsername
    ? `${username.toLowerCase()}-${randomNumber}`
    : username;

  // fetch only userIds
  const users = await User.find({}, { userId: 1, _id: 0 });

  const usedIds = new Set(
    users.map((user) => parseInt(user.userId.replace("SD", ""), 10))
  );

  let userIdNumber = 1;

  while (usedIds.has(userIdNumber)) {
    userIdNumber++;
  }

  const userId = `SD${userIdNumber}`;

  try {
    const user = await User.create({
      fullName,
      userPic,
      userId,
      email,
      phone,
      password,
      username: finalUsername,
      gender: "",
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered successfully"));
  } catch (err) {
    throw new ApiError(500, "Failed to create user: " + err.message);
  }
});

// Route 5: Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  console.log(email);

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

// Route 6: Logout User
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

// Route 7: Refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// Route 8: Change Current Password
const changeCurrentPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
};

// Route 9: Get Current User
const getCurrentUser = async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
};

// Route 10: Update Account Details
const updateAccountDetails = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        ...req.body,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
};

// Route 11: Update User Avatar
const updateUserAvatar = async (req, res) => {
  const LocalPath = req.file?.path;

  if (!LocalPath) {
    throw new ApiError(400, "file is missing");
  }
  const userpic = LocalPath;

  if (!userpic) {
    throw new ApiError(400, "Error while uploading");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        userPic: userpic,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User image updated successfully"));
};

// router.route("/register").post(registerUser);
router.route("/register").post(upload.single("userPic"), registerUser);

router.route("/send-otp").post(sendOtp);
router.route("/verify-otp").post(verifyOtp);

router.route("/login").post(loginUser);
//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

module.exports = router;
