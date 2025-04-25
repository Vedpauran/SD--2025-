const express = require("express");
const router = express.Router();
const {
  initiatePayment,
  verifyPayment,
} = require("../../controllers/payment/paymentController");

router.post("/get-payment", initiatePayment);
router.post("/verify/:txnid", verifyPayment);

module.exports = router;
