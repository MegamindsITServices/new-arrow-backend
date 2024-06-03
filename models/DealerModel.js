import mongoose from "mongoose";

const DealerSchema = new mongoose.Schema(
  {
    dealername: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    slug: {
      type: String,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "dealer_state",
      required: false,
    },
    address: {
      type: {},
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Dealer", DealerSchema);
