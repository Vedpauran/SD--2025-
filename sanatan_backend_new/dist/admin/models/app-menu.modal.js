const mongoose = require("mongoose");
const {
  Schema
} = mongoose;
const AppMenuSchema = new Schema({
  Status: {
    type: String
  },
  Language: {
    type: String,
    required: true
  },
  Settings: {
    type: Object
  },
  General: {
    type: Object
  },
  AppSetting: {
    type: Object
  },
  AccountSetting: {
    type: Object
  },
  Account: {
    type: Object
  },
  Support: {
    type: Object
  },
  Information: {
    type: Object
  },
  Collection: {
    type: Object
  },
  Wishlist: {
    type: Object
  },
  Donation: {
    type: Object
  },
  Whatnew: {
    type: Object
  },
  Profile: {
    type: Object
  },
  Password: {
    type: Object
  },
  ChangeEmail: {
    type: Object
  },
  ChangePhone: {
    type: Object
  },
  Notification: {
    type: Object
  },
  Languages: {
    type: Object
  },
  Theme: {
    type: Object
  },
  Audio: {
    type: Object
  },
  PlayBack: {
    type: Object
  },
  DataSaver: {
    type: Object
  },
  Faq: {
    type: Object
  },
  Contact: {
    type: Object
  },
  About: {
    type: Object
  },
  Policy: {
    type: Object
  },
  Terms: {
    type: Object
  },
  Disclaimer: {
    type: Object
  },
  Social: {
    type: Object
  },
  FeedBack: {
    type: Object
  },
  Rate: {
    type: Object
  },
  Report: {
    type: Object
  },
  Refund: {
    type: Object
  },
  CustomerSupport: {
    type: Object
  },
  DeleteAccount: {
    type: Object
  }
}, {
  timestamps: true
});
const AppMenu = mongoose.model("AppMenu", AppMenuSchema);
module.exports = AppMenu;
//# sourceMappingURL=app-menu.modal.js.map