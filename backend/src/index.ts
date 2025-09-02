import express, { Request, Response } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const app = express();

// Указываем хранилище для файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // папка для сохранения
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext); // уникальное имя
  },
});

const upload = multer({ storage });

// Роут для загрузки файла
app.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "File not uploaded" });
  }
  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });
});

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});