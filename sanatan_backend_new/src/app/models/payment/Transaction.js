const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    txnid: String,
    amount: String,
    status: String,
    product: Object,
    firstname: String,
    email: String,
    phone: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
