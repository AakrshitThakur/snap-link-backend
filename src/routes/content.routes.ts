import express from "express";
import { Content } from "../models/content.model.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import type { Request, Response } from "express";

const router = express.Router();

router.get("/all", authMiddleware, async (req: Request, res: Response) => {
  console.log(req.userCredentials);
  res.json({ message: "lsadjflsdjk" });
});

export { router };
