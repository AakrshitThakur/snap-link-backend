import type { Response } from "express";
import { CONTENT_TYPE, CONTENT_TYPE_MAX_LENGTH } from "./constants/content.constants.js";

function validateContent(content: any, res: Response): boolean {
  if (typeof content === "object" && content !== null) {
    if (content.title && content.url && CONTENT_TYPE.includes(content.type)) {
      return true;
    }
  }
  // error response
  res.status(400).json({
    message: `Invalid input. Please provide all required fields: type - {${CONTENT_TYPE}} , URL, and title - max length of ${CONTENT_TYPE_MAX_LENGTH}`,
  });
  return false;
}
// function validatePutContent(content: any, res: Response): boolean {
//   if (typeof content === "object" && content !== null) {
//     if (content.title && content.url && content.type && content.id) return true;
//   }
//   res.status(400).json({
//     message:
//       "Invalid input. Please provide all required fields: id, type, URL, and title",
//   });
//   return false;
// }

export { validateContent };
