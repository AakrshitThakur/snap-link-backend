import type { Response } from "express";

function validateContent(content: any, res: Response): boolean {
  if (typeof content === "object" && content !== null) {
    if (content.title && content.url && content.type) return true;
  }
  res.status(400).json({
    message:
      "Invalid input. Please provide all required fields: type, URL, and title",
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
