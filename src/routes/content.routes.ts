import express from "express";
import type { Request, Response } from "express";
import { Types, Error } from "mongoose";
import { Content } from "../models/content.model.js";
import { User } from "../models/auth.model.js";
import { Tag } from "../models/tag.model.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateContent } from "../utils/content.utils.js";
import { FILTER_CONTENT_TYPE } from "../utils/constants/content.constants.js";

const router = express.Router();

// router.get("/all", authMiddleware, async (req: Request, res: Response) => {
//   try {
//     const userCredentials = req.userCredentials;

//     // check if user exists
//     const user = await User.findById(userCredentials?.id);
//     if (!user) {
//       res
//         .status(401)
//         .json({ message: "Please sign in or create an account to continue" });
//       return;
//     }

//     // get all contents
//     const contents = await Content.find({ ownerId: user._id }, "-__v").populate(
//       { path: "tagIds", select: "-_id -__v" }
//     );

//     // success response
//     res
//       .status(200)
//       .json({ message: "All contents have been received", contents });
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       console.error("Error message:", err.message);
//       res.status(400).json({ message: err.message });
//     } else {
//       console.error("Unknown error:", err);
//       res.status(400).json({ message: err });
//     }
//     return;
//   }
// });

router.get("/all", authMiddleware, async (req: Request, res: Response) => {
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

    const type = req.query.type;
    if (!type) {
      // get all contents
      const contents = await Content.find(
        { ownerId: user._id },
        "-__v"
      ).populate({ path: "tagIds", select: "-_id -__v" });

      // success response
      res
        .status(200)
        .json({ message: "All contents have been received", contents });
      return;
    }
    if (typeof type === "string" && FILTER_CONTENT_TYPE[type]) {
      // get filtered content
      const contents = await Content.find(
        { ownerId: user._id, type: FILTER_CONTENT_TYPE[type] },
        "-__v -ownerId"
      ).populate({ path: "tagIds", select: "-_id -__v" });

      // success response
      res
        .status(200)
        .json({ message: "Filtered contents have been received", contents });
      return;
    }

    // error response
    res
      .status(400)
      .json({ message: "Please provide a valid content type filter" });
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

// create new content based which refers to User and Tag (optional)
router.post("/create", authMiddleware, async (req: Request, res: Response) => {
  try {
    const content = req.body;

    // validate input content
    if (!validateContent(content, res)) return;

    // get authenticated user-id
    const userCredentials = req.userCredentials;
    if (!userCredentials) {
      res
        .status(401)
        .json({ message: "Please sign in or create an account to continue" });
      return;
    }

    // check if user exists
    const user = await User.findById(userCredentials.id);
    if (!user) {
      res
        .status(401)
        .json({ message: "Please sign in or create an account to continue" });
      return;
    }

    // Checking if content.title exists or not
    const alreadyExists = await Content.findOne({ title: content.title });
    if (alreadyExists) {
      res.status(403).json({ message: "This title is already taken" });
      return;
    }

    // inserting new tags
    const tagTitles: string[] = content.tags;
    for (const title of tagTitles) {
      await Tag.updateOne(
        { title }, // query
        { $setOnInsert: { title } }, // insert only if not exists
        { upsert: true } // ensure insert if not found
      );
    }

    // fetching all tags from DB
    const tags = await Tag.find({ title: { $in: tagTitles } });

    // getting { _id } from tags
    const ids = tags.map((t) => {
      return { _id: t._id };
    });

    // creating content
    const newContent = new Content({
      ...content,
      ownerId: userCredentials.id,
      tagIds: ids,
    });
    await newContent.save();

    // success response
    res
      .status(200)
      .json({ message: "Content creation completed successfully" });
    // res.status(200).json({ message: "All contents have been received" });
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

router.get(
  "/:contentId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      //validate content id from url params
      const contentId = req.params.contentId;
      if (!contentId || contentId?.length !== 24) {
        res.status(400).json({ message: "Kindly provide a valid content ID" });
        return;
      }

      const userCredentials = req.userCredentials;

      // check if user exists
      const user = await User.findById(userCredentials?.id);
      if (!user) {
        res
          .status(401)
          .json({ message: "Please sign in or create an account to continue" });
        return;
      }

      // get content
      const content = await Content.findById(contentId).populate("tagIds");
      if (!content) {
        res
          .status(400)
          .json({ message: "Requested content could not be found" });
        return;
      }

      // check authorization
      if (content.ownerId instanceof Types.ObjectId) {
        if (content.ownerId.toString() !== user._id.toString()) {
          res
            .status(403)
            .json({ message: "Not authorized to update this content" });
          return;
        }
      } else {
        res.status(500).json({ message: "Oops, something went wrong" });
        return;
      }

      // success response
      res
        .status(200)
        .json({ message: "Content successfully received", content });
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

router.put(
  "/:contentId/update",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      //validate content id from url params
      const contentId = req.params.contentId;
      if (!contentId || contentId?.length !== 24) {
        res.status(400).json({ message: "Kindly provide a valid content ID" });
        return;
      }

      const content = req.body;

      // validate input content
      if (!validateContent(content, res)) return;

      // get authenticated user-id
      const userCredentials = req.userCredentials;
      if (!userCredentials) {
        res
          .status(401)
          .json({ message: "Please sign in or create an account to continue" });
        return;
      }

      // check if user exists
      const user = await User.findById(userCredentials.id);
      if (!user) {
        res
          .status(401)
          .json({ message: "Please sign in or create an account to continue" });
        return;
      }

      // get content from contentId provided in the url parameter
      const c = await Content.findById(contentId);
      if (!c) {
        res.status(400).json({ message: "Kindly provide a valid content ID" });
        return;
      }

      // check authorization
      if (c.ownerId instanceof Types.ObjectId) {
        if (c.ownerId.toString() !== user._id.toString()) {
          res
            .status(403)
            .json({ message: "Not authorized to update this content" });
          return;
        }
      } else {
        res.status(500).json({ message: "Oops, something went wrong" });
        return;
      }

      // inserting new tags
      const tagTitles: string[] = content.tags;
      for (const title of tagTitles) {
        await Tag.updateOne(
          { title }, // query
          { $setOnInsert: { title } }, // insert only if not exists
          { upsert: true } // ensure insert if not found
        );
      }

      // fetching all tags from database
      const tags = await Tag.find({ title: { $in: tagTitles } });

      // getting { _id } from tags
      const ids = tags.map((t) => {
        return { _id: t._id };
      });

      // Update a user's name by ID
      const updatedContent = await Content.findByIdAndUpdate(
        contentId, // _id
        {
          title: content.title,
          url: content.url,
          type: content.type,
          tagIds: ids,
        }, // Update object
        { new: true, runValidators: true } // obey schema rules
      );

      console.log(updatedContent);

      // error response
      if (!updatedContent) {
        res.status(500).json({ message: "Oops, something went wrong" });
        return;
      }
      // success response
      res.status(200).json({ message: "Content successfully updated" });
      return;
    } catch (err: unknown) {
      if (err instanceof Error.CastError) {
        res.status(400).json({ message: "Invalid content ID format" });
      } else if (err instanceof Error.ValidationError) {
        console.error(err.message);
        res.status(400).json({ message: "Validation failed" });
      } else if (err instanceof Error) {
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

router.delete(
  "/:contentId/delete",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      //validate content id from url params
      const contentId = req.params.contentId;
      if (!contentId || contentId?.length !== 24) {
        res.status(400).json({ message: "Kindly provide a valid content ID" });
        return;
      }

      const userCredentials = req.userCredentials;

      // check if user exists
      const user = await User.findById(userCredentials?.id);
      if (!user) {
        res
          .status(401)
          .json({ message: "Please sign in or create an account to continue" });
        return;
      }

      // get content
      const content = await Content.findById(contentId);
      if (!content) {
        res
          .status(400)
          .json({ message: "Requested content could not be found" });
        return;
      }

      // check authorization
      if (content.ownerId instanceof Types.ObjectId) {
        if (content.ownerId.toString() !== user._id.toString()) {
          res
            .status(403)
            .json({ message: "Not authorized to update this content" });
          return;
        }
      } else {
        res.status(500).json({ message: "Oops, something went wrong" });
        return;
      }

      const deletedContent = await Content.findByIdAndDelete(contentId);

      // error response
      if (!deletedContent) {
        res.status(500).json({ message: "Oops, something went wrong" });
        return;
      }

      // success response
      res.status(200).json({ message: "Content successfully deleted" });
    } catch (error: unknown) {
      if (error instanceof Error.CastError) {
        console.error(error.message);
        res.status(400).json({ message: "Invalid content ID format" });
      } else if (error instanceof Error) {
        console.error(error.message);
        res.status(400).json({ message: error.message });
      } else {
        console.error(error);
        res.status(400).json({ message: error });
      }
    }
  }
);

export { router };
