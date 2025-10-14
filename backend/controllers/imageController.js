const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const ImageMetadata = require("../models/ImageMetadataModel");
const formatFileName = require("../utils/formatFileName");
const IMG_DIRECTORY_PATH = "public/img";


// Multer setup — store uploaded files in memory
const multerStorage = multer.memoryStorage();
const upload = multer({
  storage: multerStorage,
});

exports.getAllImages = async (req, res, next) => {
  try {
    const data = await ImageMetadata.find();

    return res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching images",
    });
  }
};

// Middleware to handle single file upload
exports.uploadImage = upload.single("photo");


exports.createImageMetadata = async (req, res, next) => {
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
