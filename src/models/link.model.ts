import mongoose from "mongoose";
import { Types } from "mongoose";

const LinkSchema = new mongoose.Schema({
  hash: { type: String, required: true },
  ownerId: { type: Types.ObjectId, ref: "User", required: true },
});

const Link = mongoose.model("Link", LinkSchema);
export { Link };
