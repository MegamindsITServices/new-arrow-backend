import mongoose from "mongoose";
const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  slug: {
    type: String,
    lowercase: true,
  },
});

export default mongoose.model("subject", subjectSchema);
