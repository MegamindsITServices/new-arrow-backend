import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    author: {
      type: String,
      required: false,
    },
    pages: {
      type: String,
      required: false,
    },
    subject: {
      type: mongoose.ObjectId,
      ref: "subject",
      required: false,
    },
    price: {
      type: String,
      required: false,
    },
    isbn: {
      type: String,
      required: false,
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: false,
    },
    // quantity: {
    //   type: Number,
    //   required: false,
    // },
    shipping: {
      type: Boolean,
      default: false,
    },
    photo: {
      data: Buffer,
      contentType: String,
      required: false,
    },
    frontphoto: {
      data: Buffer,
      contentType: String,
      required: false,
    },
    backphoto: {
      data: Buffer,
      contentType: String,
      required: false,
    },
    uid: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("products", productSchema);
