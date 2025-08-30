import type { Response } from "express";
import {
  CONTENT_TYPE,
  CONTENT_TITLE_MAX_LENGTH,
  CONTENT_TITLE_MIN_LENGTH,
} from "./constants/content.constants.js";

function validateContent(content: any, res: Response): boolean {
  if (typeof content === "object" && content !== null) {
    if (
      content.title.length <= CONTENT_TITLE_MAX_LENGTH &&
      content.title.length >= CONTENT_TITLE_MIN_LENGTH &&
      content.url &&
      CONTENT_TYPE.includes(content.type)
    ) {
      return true;
    }
  }
  // error response
  res.status(400).json({
    message: `Invalid input. Please provide all required fields: type - {${CONTENT_TYPE}} , URL, and title - max length of ${CONTENT_TITLE_MAX_LENGTH} and min length - ${CONTENT_TITLE_MIN_LENGTH}`,
  });
  return false;
}

export { validateContent };
