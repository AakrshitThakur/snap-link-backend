import type { Response } from "express";
import {
  USERNAME_REGEX,
  PASSWORD_REGEX,
  EMAIL_REGEX,
} from "./constants/auth.constants.js";

function validateSignin(credentials: any, res: Response): boolean {
  if (!credentials) {
    res.status(403).json({
      message:
        "Please provide all required credentials: username, email, and password",
    });
    return false;
  }

  const errors: string[] = [];

  if (!EMAIL_REGEX.test(credentials.email)) {
    errors.push("Invalid email format.");
  }
  if (!PASSWORD_REGEX.test(credentials.password)) {
    errors.push(
      "Password must be at least 8 characters, contain one uppercase and one number."
    );
  }

  if (errors.length > 0) {
    res.status(403).json({
      message: "Invalid credentials format",
      errors,
    });
    return false;
  }
  return true;
}

function validateSignup(credentials: any, res: Response): boolean {
  if (!credentials) {
    res.status(403).json({
      message:
        "Please provide all required credentials: username, email, and password",
    });
    return false;
  }

  const errors: string[] = [];

  if (!USERNAME_REGEX.test(credentials.username)) {
    errors.push(
      "Username must be 3-20 characters, letters/numbers/underscores only."
    );
  }
  if (!EMAIL_REGEX.test(credentials.email)) {
    errors.push("Invalid email format.");
  }
  if (!PASSWORD_REGEX.test(credentials.password)) {
    errors.push(
      "Password must be at least 8 characters, contain one uppercase and one number."
    );
  }

  if (errors.length > 0) {
    res.status(403).json({
      message: "Invalid credentials format",
      errors,
    });
    return false;
  }
  return true;
}

export { validateSignup, validateSignin };
