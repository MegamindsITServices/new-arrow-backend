import mongoose from "mongoose";

const dealerStateSchema = new mongoose.Schema({
  state: {
    type: String,
    // required: true,
    // unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
});

export default mongoose.model("dealer_state", dealerStateSchema);
