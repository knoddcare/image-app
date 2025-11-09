import express from "express";
import {
  createImageMetadata,
  getAllImages,
  uploadImage,
  loadImage,
  checkFileAndFileType,
  resizeImage,
  generateImageName,
} from "../controllers/imageController.js";

export const imageRouter = express.Router();

imageRouter.route("/")
  .get(getAllImages)
  .post(
    loadImage,
    checkFileAndFileType,
    resizeImage,
    generateImageName,
    uploadImage,
    createImageMetadata,
  );
