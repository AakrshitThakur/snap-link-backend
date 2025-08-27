import mongoose from "mongoose";
import { Types } from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["document", "image", "video", "audio", "article"],
      require: true,
    },
    url: { type: String, require: true },
    title: { type: String, require: true, unique: true },
    ownerId: { type: Types.ObjectId, ref: "User", require: true },
    tagIds: [{ type: Types.ObjectId, ref: "Tag" }],
  },
  { timestamps: true }
);

const Content = mongoose.model("Content", ContentSchema);
export { Content };
