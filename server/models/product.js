const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    product_Name: { type: String, required: true },
    product_Price: {
      type: Number,
      required: true,
      min: [0, "Price must be a positive number"],
    },
    product_Description: {
      type: String,
      required: true,
      // minlength: [10, "Description too short"],
    },
    Affiliate_link: { type: String, required: false },
    product_Images: [{ type: String, required: true }],
    product_Gender: { type: String, required: false, enum: ["Men", "Women", "Both"] },
    product_Category: {
      type: String,
      enum: ["equipement", "clothing", "supplement", "accessories", "others"],
    },
    incart: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
