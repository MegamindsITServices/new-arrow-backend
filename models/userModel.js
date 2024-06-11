import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      shippingAddress: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      locality: {
        type: String,
        required: true,
      },
      landmark: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
    },
    answer: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    cart: [{}],
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
