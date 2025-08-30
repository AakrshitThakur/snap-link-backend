import mongoose from "mongoose";
import { Types } from "mongoose";

const LinkSchema = new mongoose.Schema({
  ownerId: { type: Types.ObjectId, ref: "User", required: true, unique: true },
});

const Link = mongoose.model("Link", LinkSchema);
export { Link };
