const crypto = require("crypto");
const {
  payuClient,
  payu_key,
  payu_salt,
} = require("../../../admin/config/payu.config");
const Transaction = require("../../../app/models/payment/Transaction");

exports.initiatePayment = async (req, res) => {
  try {
    const txn_id = "PAYU_MONEY_" + Math.floor(Math.random() * 8888888);
    const { amount, product, firstname, email, mobile } = req.body;

    const udf1 = "",
      udf2 = "",
      udf3 = "",
      udf4 = "",
      udf5 = "";

    const hashString = `${payu_key}|${txn_id}|${amount}|${JSON.stringify(
      product
    )}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${payu_salt}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    const data = await payuClient.paymentInitiate({
      isAmountFilledByCustomer: false,
      txnid: txn_id,
      amount: amount,
      currency: "INR",
      productinfo: JSON.stringify(product),
      firstname,
      email,
      phone: mobile,
      surl: `http://localhost:${process.env.PORT}/api/payment/verify/${txn_id}`,
      furl: `http://localhost:${process.env.PORT}/api/payment/verify/${txn_id}`,
      hash,
    });

    // Optional: Save in DB
    await Transaction.create({
      txnid: txn_id,
      amount,
      product,
      firstname,
      email,
      phone: mobile,
      status: "initiated",
    });

    res.send(data);
  } catch (error) {
    res.status(400).send({ msg: error.message, stack: error.stack });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const txnid = req.params.txnid;
    const verified = await payuClient.verifyPayment(txnid);
    const data = verified.transaction_details[txnid];

    // Optional: Update in DB
    await Transaction.findOneAndUpdate({ txnid }, { status: data.status });

    res.redirect(`http://localhost:5173/payment/${data.status}/${data.txnid}`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
