// src/admin/config/payu.config.js
const PayU = require("payu-websdk");

const payu_key = process.env.MERCHANT_ID; // ✅ make sure this env variable exists
const payu_salt = process.env.MERCHANT_SALT; // ✅ and this one too
const environment = process.env.PAYU_ENVIRONMENT; // 'test' or 'prod'

let payuClient;

if (payu_key && payu_salt) {
  payuClient = new PayU(
    {
      key: payu_key,
      salt: payu_salt,
    },
    environment
  );
} else {
  console.error(" PayU credentials are missing!");
}

module.exports = {
  payuClient,
  payu_key,
  payu_salt,
};
