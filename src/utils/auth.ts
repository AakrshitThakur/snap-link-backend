import type { Response } from "express";

// the previous character class i.e. [a-zA-Z0-9_] must repeat at least 3 times and at most 20
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

// [^\s@] = any character except whitespace and @
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// (?= ... ) is a lookahead.
// It means: "there must be … somewhere in the string."
// .*[A-Z] = any characters, followed by an uppercase letter (A–Z).
// 👉 This ensures the string has at least one uppercase letter.
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/;

function validateSignup(credentials: any, res: Response): boolean {
  if (!credentials) {
    res.status(403).json({
      message:
        "Please provide all required credentials: username, email, and password",
    });
    return false;
  }

  const errors: string[] = [];

  if (!emailRegex.test(credentials.email)) {
    errors.push("Invalid email format.");
  }
  if (!passwordRegex.test(credentials.password)) {
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

function validateSignin(credentials: any, res: Response): boolean {
  if (!credentials) {
    res.status(403).json({
      message:
        "Please provide all required credentials: username, email, and password",
    });
    return false;
  }

  const errors: string[] = [];

  if (!usernameRegex.test(credentials.username)) {
    errors.push(
      "Username must be 3-20 characters, letters/numbers/underscores only."
    );
  }
  if (!emailRegex.test(credentials.email)) {
    errors.push("Invalid email format.");
  }
  if (!passwordRegex.test(credentials.password)) {
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
