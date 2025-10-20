import express from "express";
import * as imageController from "../controllers/imageController";

const router = express.Router();

router
  .route("/")
  .get(imageController.getAllImages)
  .post(imageController.uploadImage, imageController.createImageMetadata);

export default router;
