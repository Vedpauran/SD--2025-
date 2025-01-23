const S3_CONFIG = {
  REGION: process.env.AWS_S3_REGION,
  ACCESS_KEY_ID: process.env.AWS_S3_ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY,
  BUCKET: process.env.AWS_S3_BUCKET_NAME,
  S3_BASE_URL: process.env.AWS_S3_BASE_URL,
};

module.exports = S3_CONFIG;
