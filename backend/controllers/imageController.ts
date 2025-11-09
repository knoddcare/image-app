import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ImageMetadataModel } from "../models/ImageMetadataModel.js";
import { AppError, ERROR_MESSAGES } from "../errors/AppError.js";
import fs from "fs/promises";
import sharp, { FormatEnum, JpegOptions, PngOptions } from "sharp";

const ACCEPTED_FILE_TYPES = ["jpeg", "png", "jpg"];
const IMG_DIRECTORY_PATH = "public/img";
const DEFAULT_EXTENSION = "jpeg";

export const loadImage = multer({
  storage: multer.memoryStorage(),
}).single("photo");

export const getAllImages = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const data = await ImageMetadataModel.find();

  return res.status(200).json({
    status: "success",
    data: data,
  });
};

// Generate name to first 10 letters and end with timestamp eg. Test_20230101120000.jpeg, replace spaces with hyphens and åä with a and ö with o
export const generateName = (name: string) : string => {
  const timestamp = Date.now();
  return `${name.toLowerCase().replace(/\s+/g, "-").replace(/[åä]/g, "a").replace(/[ö]/g, "o").substring(0, 10)}_${timestamp}`;
}

export function checkFileAndFileType(_req: Request, res: Response, _next: NextFunction): void {
  try {
    const file = _req.file;

    if (!file) {
      return _next(new AppError("No file uploaded", 400, {
        status: "fail",
        message: ERROR_MESSAGES.MISSING_FILE,
      }));
    }

    const fileType = file.mimetype.split("/")[1];
    if (!ACCEPTED_FILE_TYPES.includes(fileType)) {
      return _next(new AppError("Invalid file type", 400, {
        status: "fail",
        message: ERROR_MESSAGES.INVALID_FILE_TYPE,
      }));
    }
    return _next();
  } catch (err) {
    return _next(err);
  }
}

export async function resizeImage(_req: Request, _res: Response, _next: NextFunction): Promise<void> {
  try {
    const file = _req.file;

    if (!file) {
      return _next(new AppError("No file uploaded", 400, {
        status: "fail",
        message: ERROR_MESSAGES.MISSING_FILE,
      }));
    }

    const extension = (file.mimetype.split("/")[1] || DEFAULT_EXTENSION) as keyof FormatEnum;

    file.buffer = await sharp(file.buffer)
      .resize(400, 400)
      .toFormat(extension)
      .toBuffer();

    return _next();

  } catch (err) {
    return _next(err);
  }
}

export function generateImageName(_req: Request, _res: Response, _next: NextFunction): void {
  const fileName = _req.body.name || null;
  const file = _req.file

  if (!fileName) {
    return _next(new AppError("Missing name", 400, {
      status: "fail",
      message: ERROR_MESSAGES.MISSING_NAME,
    }));
  }

  if (!file) {
    return _next(new AppError("No file uploaded", 400, {
      status: "fail",
      message: ERROR_MESSAGES.MISSING_FILE,
    }));
  }

  const extension = file.mimetype.split("/")[1] || DEFAULT_EXTENSION;
  const uniqueName = `${generateName(fileName)}.${extension}`
  file.filename = uniqueName;
  _req.body.name = uniqueName;
  return _next();
}

export async function uploadImage(_req: Request, res: Response, _next: NextFunction): Promise<void> {
  try {
    const file = _req.file || null;

    if (!file) {
      return _next(new AppError("No file uploaded", 400, {
        status: "fail",
        message: ERROR_MESSAGES.MISSING_FILE,
      }));
    }

    const filePath = `${IMG_DIRECTORY_PATH}/${file.filename}`;
    await fs.writeFile(filePath, file.buffer);

    return _next();

  } catch (err) {
    return _next(err);
  }
}

export const createImageMetadata = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    if (!_req.file) {
      return _next(new AppError("No file uploaded", 400, {
        status: "fail",
        message: ERROR_MESSAGES.MISSING_FILE,
      }));
    }

    const doc = await ImageMetadataModel.create({
      name: _req.body.name,
      path: `/img/${_req.file.filename}`,
    });

    if (!doc) {
      return _next(new AppError("Invalid input", 400, {
        status: "fail",
        message: ERROR_MESSAGES.INVALID_INPUT,
      }));
    }

    return res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  } catch (err) {
    return _next(err);
  }
};
