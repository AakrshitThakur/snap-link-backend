import express from "express";
import { Link } from "../models/link.model.js";
import { User } from "../models/auth.model.js";
import { Content } from "../models/content.model.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import type { Request, Response } from "express";

const router = express.Router();

// create new sharable link based
router.post("/create", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userCredentials = req.userCredentials;

    // check if user exists
    const user = await User.findById(userCredentials?.id);
    if (!user) {
      res
        .status(401)
        .json({ message: "Please sign in or create an account to continue" });
      return;
    }

    // check if link is already shared
    const link = await Link.findOne({ ownerId: user._id });
    if (link) {
      res.status(403).json({
        message: "Shareable link has already been created",
      });
      return;
    }

    // create a new link
    const newLink = new Link({ ownerId: user._id });
    await newLink.save();

    // success response
    res.status(200).json({
      message: "Shareable content link successfully generated",
      id: newLink._id,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error message:", err.message);
      res.status(400).json({ message: err.message });
    } else {
      console.error("Unknown error:", err);
      res.status(400).json({ message: err });
    }
    return;
  }
});

// get content of user to share
router.get("/:linkId", async (req: Request, res: Response) => {
  try {
    //validate link id from url params
    const linkId = req.params.linkId;
    if (!linkId || linkId?.length !== 24) {
      res.status(400).json({ message: "Kindly provide a valid link ID" });
      return;
    }

    // check if link exists
    const link = await Link.findOne({ _id: linkId });
    if (!link) {
      res.status(400).json({
        message: "Shareable link has not been created yet",
      });
      return;
    }

    // get owner's username
    const user = await User.findOne({ _id: link?.ownerId }, "username");
    if (!user) {
      res
        .status(400)
        .json({ message: "Owner of the shareable link could not be found" });
      return;
    }

    // get content
    const contents = await Content.find({ ownerId: link?.ownerId }).populate(
      "tagIds"
    );
    if (!contents) {
      res.status(403).json({
        message: "No contents found",
      });
    }

    // success response
    const share = {
      username: user.username,
      contents: contents,
    };
    res.status(200).json({
      message: `Successfully retrieved all contents of ${user.username}`,
      share,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Er ror message:", err.message);
      res.status(400).json({ message: err.message });
    } else {
      console.error("Unknown error:", err);
      res.status(400).json({ message: err });
    }
    return;
  }
});

// delete sharable link
router.delete(
  "/delete",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userCredentials = req.userCredentials;

      // check if user exists
      const user = await User.findById(userCredentials?.id);
      if (!user) {
        res
          .status(401)
          .json({ message: "Please sign in or create an account to continue" });
        return;
      }

      // check if link is created
      const link = await Link.findOne({ ownerId: user._id });
      if (!link) {
        res.status(403).json({
          message: "Shareable link has not been created yet",
        });
        return;
      }

      // delete shareable link
      const deletedLink = await Link.deleteOne({ _id: link._id });

      // error response
      if (!deletedLink) {
        res.status(500).json({ message: "Oops, something went wrong" });
        return;
      }

      // success response
      res.status(200).json({
        message: "Shareable content link successfully deleted",
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error message:", err.message);
        res.status(400).json({ message: err.message });
      } else {
        console.error("Unknown error:", err);
        res.status(400).json({ message: err });
      }
      return;
    }
  }
);

export { router };
