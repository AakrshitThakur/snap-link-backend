import jsonwebtoken from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";
import type { UserCredentials } from "../custom-types/auth.js";
import dotenv from "dotenv";

dotenv.config();

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const jwt: string = req.cookies.jwt;

  if (!jwt) {
    return res
      .status(401)
      .json({ message: "Please sign in or create an account to continue" });
  }

  jsonwebtoken.verify(
    jwt,
    process.env.JWT_SECRET_USER || "snap-link-backend",
    function (error, payload) {
      if (error) {
        console.error(error);
        return res.status(401).json({ message: error.message });
      }
      if (typeof payload === undefined) {
        return res.status(403).json({
          message:
            "Invalid user ID. Please sign in or sign up with a new account.",
        });
      } else if (typeof payload === "object") {
        req.userCredentials = payload as UserCredentials; // type assertion
        next();
      } else {
        // rare case: payload is a string
        return res.status(401).json({ message: "Invalid token payload" });
      }
    }
  );
}

export { authMiddleware };
