import { NextFunction, Request, Response } from "express";
import multer from "multer";
import ImageMetadata from "../models/ImageMetadataModel";

const IMG_DIRECTORY_PATH = "public/img";

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMG_DIRECTORY_PATH);
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    cb(null, `${req.body.name}.${extension}`);
  },
});

const upload = multer({
  storage: multerStorage,
});

export const getAllImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = await ImageMetadata.find();

  return res.status(200).json({
    status: "success",
    data: data,
  });
};

export const uploadImage = upload.single("photo");

export const createImageMetadata = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return res.status(400).json({
      status: "fail",
      message: "No file uploaded",
    });
  }

  const doc = await ImageMetadata.create({
    name: req.body.name,
    path: `/img/${req.file.filename}`,
  });

  if (!doc) {
    return res.status(400).json({
      status: "fail",
      message: "invalid input",
    });
  }

  return res.status(201).json({
    status: "success",
    data: {
      data: doc,
    },
  });
};
