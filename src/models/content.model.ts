import mongoose from "mongoose";
import type { ContentType } from "../custom-types/content.js";

const ContentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["document", "tweet", "youtube", "link"],
      require: true,
    },
    url: { type: String, require: true },
    title: { type: String, require: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const Content = mongoose.model("Content", ContentSchema);
export { Content };
