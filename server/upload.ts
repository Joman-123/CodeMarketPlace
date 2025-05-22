import type { Express, Request, Response } from "express";
import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

export function registerUploadRoute(app: Express) {
  // إعداد مجلد التخزين
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const uploadDir = path.join(__dirname, "../uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // إعداد multer
  const storage: StorageEngine = multer.diskStorage({
    destination: function (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
      cb(null, uploadDir);
    },
    filename: function (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  const upload = multer({ storage });

  // مسار رفع الملفات
  app.post("/api/upload", upload.single("file"), (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      return res.status(400).json({ message: "لم يتم رفع أي ملف" });
    }
    res.json({
      filename: file.filename,
      originalname: file.originalname,
      path: `/uploads/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
    });
  });
}
