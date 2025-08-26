import express from "express";
import type { JwtPayload } from "jsonwebtoken";
import type { UserCredentials } from "./custom-types/auth.ts";

// Augmenting new keys to Request interface
declare global {
  namespace Express {
    interface Request {
      userCredentials?: UserCredentials;
    }
  }
}
