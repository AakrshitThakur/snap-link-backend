import mongoose from "mongoose";
import type { Response } from "express";
import { User } from "../models/auth.model.js";

async function doesUsernameExists(username: string, res: Response) {
  const user = await User.findOne({ username });
  if (user) {
    res.status(403).json({ message: "This username is already taken" });
    return true;
  }
  return false;
}
async function doesEmailExists(email: string, res: Response): Promise<boolean> {
  const user = await User.findOne({ email });
  if (user) {
    res.status(403).json({
      message: "This email address is already registered. Please enter a different email address or log in using the same one",
    });
    return true;
  }
  return false;
}

export { doesUsernameExists, doesEmailExists };
