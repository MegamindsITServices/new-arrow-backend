import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
    ],

    products_name: [
      {
        type: String,
      },
    ],
    quantities: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    payment: {
      type: Number,
    },
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },

    status: {
      type: String,
      default: "Unprocessed",
      enum: [
        "Not Process",
        "Unprocessed",
        "Processing",
        "Shipped",
        "delivered",
        "cancel",
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
