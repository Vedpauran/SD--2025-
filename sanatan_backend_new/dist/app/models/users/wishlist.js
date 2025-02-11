const mongoose = require("mongoose");
const {
  Schema
} = mongoose;
const {
  ObjectId
} = require("mongodb");
const wishlistSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  item: {
    type: Schema.Types.ObjectId,
    ref: "Item",
    required: true
  },
  type: {
    type: String
  }
}, {
  timestamps: true
});
const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;
//# sourceMappingURL=wishlist.js.map