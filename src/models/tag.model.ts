import mongoose from "mongoose";

const TagSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
});

const Tag = mongoose.model("Tag", TagSchema);
export { Tag };
