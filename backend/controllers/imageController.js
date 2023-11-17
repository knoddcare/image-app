const multer = require("multer");
const ImageMetadata = require("../models/ImageMetadataModel");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;

const IMG_DIRECTORY_PATH = "public/img";

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${IMG_DIRECTORY_PATH}/tmp`);
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    cb(null, `${req.body.name}.${extension}`);
  },
});

const upload = multer({
  storage: multerStorage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      const err = new Error("File type not supported.");
      err.statusCode = 415;
      return cb(err);
    }
    cb(undefined, true);
  },
});

exports.getAllImages = async (req, res, next) => {
  const data = await ImageMetadata.find();

  return res.status(200).json({
    status: "success",
    data: data,
  });
};

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

exports.resizeImage = async (req, res, next) => {
  const tmpPath = req.file.path
  const destPath = `${IMG_DIRECTORY_PATH}/${path.basename(tmpPath)}`;

  await sharp(tmpPath).resize({
    width: 400,
    height: 400,
  }).toFile(destPath);

  await fs.unlink(tmpPath);

  next();
};
