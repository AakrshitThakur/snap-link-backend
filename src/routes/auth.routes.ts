import express from "express";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/auth.model.js";
import {
  doesUsernameExists,
  doesEmailExists,
} from "../queries/auth.queries.js";
import { validateSignup, validateSignin } from "../utils/auth.js";
import type { Request, Response } from "express";

dotenv.config();

const router = express.Router();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    // validating credentials
    const credentials = req.body;
    if (!validateSignup(credentials, res)) return;

    // validating email
    if (await doesEmailExists(credentials.email, res)) return;

    // validating username
    if (await doesUsernameExists(credentials.username, res)) return;

    // generate password
    const salt = 10;
    const hPassword = await bcrypt.hash(credentials.password, salt);
    credentials.password = hPassword;

    // create new user
    const newUser = new User(credentials);
    await newUser.save();

    const userCredentials = {
      id: newUser._id,
    };

    // generae jwt
    const jwt = jsonwebtoken.sign(
      userCredentials,
      process.env.JWT_SECRET_USER || "snap-link-user"
    );

    // success response
    res
      .cookie("jwt", jwt, {
        httpOnly: true, // cannot be accessed by JS
        secure: process.env.NODE_ENV === "production", // true in production
        sameSite: "strict", // CSRF protection
        maxAge: 6 * 3600000, // (6 * 1) hours
      })
      .status(200)
      .json({ message: `${newUser.username} has successfully signed up` });
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

router.post("/signin", async (req, res) => {
  try {
    // validating credentials
    const credentials = req.body;
    if (!validateSignin(credentials, res)) return;

    // get user
    const user = await User.findOne({ email: credentials.email });
    if (!user?.password) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    // compare passwords
    const compare = await bcrypt.compare(credentials.password, user.password);
    if (!compare)
      return res.status(404).json({ message: "Invalid credentials" });

    const userCredentials = {
      id: user._id,
    };

    // generate token
    const jwt = jsonwebtoken.sign(
      userCredentials,
      process.env.JWT_SECRET_USER || "snap-link-user"
    );

    // sending success response
    res.cookie("jwt", jwt, {
      httpOnly: true, // cannot be accessed by JS
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: "strict", // CSRF protection
      maxAge: 6 * 3600000, // (6 * 1) hours
    });

    res.status(200).json({ message: `welcome back ${user.username}` });
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

router.delete("/signout", async (req: Request, res: Response) => {
  try {
    // remove jwt cookie
    res.clearCookie("jwt");

    res.status(200).json({ message: "Signed out successfully" });
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

export { router };
