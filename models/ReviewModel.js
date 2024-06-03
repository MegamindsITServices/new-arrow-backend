import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("reviews", reviewSchema);
