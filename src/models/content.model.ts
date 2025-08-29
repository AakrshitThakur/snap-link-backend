import mongoose, { Types } from "mongoose";
import { CONTENT_TYPE, CONTENT_TYPE_MAX_LENGTH } from "../utils/constants/content.constants.js";

const ContentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: CONTENT_TYPE,
      require: true,
    },
    url: { type: String, require: true },
    title: { type: String, require: true, unique: true, maxLength: CONTENT_TYPE_MAX_LENGTH },
    ownerId: { type: Types.ObjectId, ref: "User", require: true },
    tagIds: [{ type: Types.ObjectId, ref: "Tag" }],
  },
  { timestamps: true }
);

const Content = mongoose.model("Content", ContentSchema);
export { Content };
