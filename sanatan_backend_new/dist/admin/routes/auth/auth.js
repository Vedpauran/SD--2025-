const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const verifyJWT = require("../../middleware/verifyJwt");
const ApiError = require("../../utils/apiError");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const Admin = require("../../models/admin");
const generateAccessAndRefereshTokens = async adminId => {
  try {
    const admin = await Admin.findById(adminId);
    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();
    admin.refreshToken = refreshToken;
    await admin.save({
      validateBeforeSave: false
    });
    return {
      accessToken,
      refreshToken
    };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating referesh and access token");
  }
};
const registerAdmin = asyncHandler(async (req, res) => {
  const {
    email,
    password
  } = req.body;
  //console.log("email: ", email);

  if ([email, password].some(field => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const existedAdmin = await Admin.findOne({
    $or: [{
      email
    }]
  });
  if (existedAdmin) {
    throw new ApiError(409, "Admin already exists");
  }
  //console.log(req.files);

  const admin = await Admin.create({
    email: email,
    password: password
  });
  const createdAdmin = await Admin.findById(admin._id).select("-password -refreshToken");
  if (!createdAdmin) {
    throw new ApiError(500, "Something went wrong while registering the Admin");
  }
  return res.status(201).json(new ApiResponse(200, createdAdmin, "Admin registered Successfully"));
});
const loginAdmin = asyncHandler(async (req, res) => {
  const {
    email,
    password
  } = req.body;
  console.log(email);
  if (!email) {
    throw new ApiError(400, "email is required");
  }
  const admin = await Admin.findOne({
    email: email
  });
  if (!admin) {
    throw new ApiError(404, "Admin does not exist");
  }
  const isPasswordValid = await admin.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid admin credentials");
  }
  const {
    accessToken,
    refreshToken
  } = await generateAccessAndRefereshTokens(admin._id);
  const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken");
  const options = {
    httpOnly: true,
    secure: true
  };
  return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, {
    admin: loggedInAdmin,
    accessToken,
    refreshToken
  }, "Admin logged In Successfully"));
});
const logoutAdmin = asyncHandler(async (req, res) => {
  await Admin.findByIdAndUpdate(req.admin._id, {
    $unset: {
      refreshToken: 1 // this removes the field from document
    }
  }, {
    new: true
  });
  const options = {
    httpOnly: true,
    secure: true
  };
  return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "Admin logged Out"));
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const admin = await Admin.findById(decodedToken?._id);
    if (!admin) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== admin?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }
    const options = {
      httpOnly: true,
      secure: true
    };
    const {
      accessToken,
      newRefreshToken
    } = await generateAccessAndRefereshTokens(admin._id);
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", newRefreshToken, options).json(new ApiResponse(200, {
      accessToken,
      refreshToken: newRefreshToken
    }, "Access token refreshed"));
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// Register route
router.route("/register").post(registerAdmin);
// Login route
router.route("/login").post(loginAdmin);
//Logout
router.route("/logout").post(verifyJWT, logoutAdmin);
router.route("/refresh-token").post(refreshAccessToken);
module.exports = router;
//# sourceMappingURL=auth.js.map