import { Request } from 'express';
import multer, { FileFilterCallback } from "multer";

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "./src/public/uploads/");
  },
  filename: function (request, file, cb) {
    const filename = Date.now() + file.originalname;
    cb(null, filename);
  }
});

function fileFilter(request: Request, file: any, cb: FileFilterCallback) {
  if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false)
    cb(new Error('File type not supported!'));
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

export default upload;