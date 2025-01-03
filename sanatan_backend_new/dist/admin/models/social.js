const mongoose = require("mongoose");
const {
  Schema
} = mongoose;
const SocialSchema = new Schema({
  label: {
    type: String
  },
  icon: {
    type: String
  },
  link: {
    type: String
  }
}, {
  timestamps: true
});
const Social = mongoose.model("Social", SocialSchema);
module.exports = Social;
//# sourceMappingURL=social.js.map