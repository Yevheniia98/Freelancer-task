"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// Enable CORS for all requests
app.use((0, cors_1.default)());
// Serve static files from uploads directory
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Указываем хранилище для файлов
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // папка для сохранения
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        cb(null, (0, uuid_1.v4)() + ext); // уникальное имя
    },
});
const upload = (0, multer_1.default)({ storage });
// Роут для загрузки файла
app.post("/upload", upload.single("file"), (req, res) => {
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
