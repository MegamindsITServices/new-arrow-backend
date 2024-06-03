import mongoose from "mongoose";
const bannerSchema = new mongoose.Schema(
  {
    photo: {
      data: Buffer,
      contentType: String,
    },
    secondphoto: {
      data: Buffer,
      contentType: String,
    },
    thirdphoto: {
      data: Buffer,
      contentType: String,
    },
    title: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("banner", bannerSchema);
