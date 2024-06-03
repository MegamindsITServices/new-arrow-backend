import mongoose, { Schema } from "mongoose";

const homeBookSchema = new Schema({
  bookphoto: {
    data: Buffer,
    contentType: String,
  },
  booktitle: {
    type: String,
    required: false,
  },
});
export default mongoose.model("BookPhoto", homeBookSchema);
