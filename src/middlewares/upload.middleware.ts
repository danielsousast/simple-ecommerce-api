import { mkdirSync } from "node:fs";
import { extname, join } from "node:path";
import { randomUUID } from "node:crypto";
import multer from "multer";
import type { Request } from "express";

const uploadDirectory = join(process.cwd(), "uploads");

// Ensure the destination exists before Multer receives the first upload.
mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, uploadDirectory);
  },
  filename: (_request, file, callback) => {
    // Keep only the extension from the client-provided name and generate a
    // filename ourselves to avoid collisions and unsafe path characters.
    callback(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`);
  },
});

const imageMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

/**
 * Reusable Multer middleware.
 *
 * Example: `upload.single("file")` or `upload.array("files", 5)`.
 */
const upload = multer({
  storage,
  fileFilter: (_request, file, callback) => {
    if (!imageMimeTypes.has(file.mimetype)) {
      callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
      return;
    }

    callback(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 5,
  },
});


function getFileUrl(req: Request, filename: string): string {
  const protocol = req.protocol;
  const host = req.get("host");
  return `${protocol}://${host}/uploads/${filename}`;
}

export const uploadSingle = upload.single("image");
export const uploadMultiple = (maxCount: number) =>
  upload.array("images", maxCount);

export default upload;
export { getFileUrl };
