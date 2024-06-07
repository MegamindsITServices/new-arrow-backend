import mongoose, { Schema } from "mongoose";

const newReleaseSchema = new Schema({
  bookphoto: {
    data: Buffer,
    contentType: String,
  },
  booktitle: {
    type: String,
    required: false,
  },
});
export default mongoose.model("NewRelease", newReleaseSchema);
