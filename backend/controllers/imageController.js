const multer = require("multer");
const moment = require("moment");
const ImageMetadata = require("../models/ImageMetadataModel");

const IMG_DIRECTORY_PATH = "public/img";

const validNameRegex = /[^a-z,\-]+/ig;

const getValidExtension = file => {
  const extension = file.mimetype.split("/")[1];

  switch (extension) {
    case 'png':
    case 'jpg':
    case 'jpeg':
      return extension;
    default:
      return;
  }
};

const getValidFileName = name => {
  return name
    .replaceAll(' ', '-')
    .replace(validNameRegex, '')
    .slice(0, 10);
};

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMG_DIRECTORY_PATH);
  },
  filename: (req, file, cb) => {
    const extension = getValidExtension(file);
    if (!extension) cb(`extension not valid, ${extension}`);

    const fileName = `${getValidFileName(req.body.name)}_${moment().format("YYYYMMDDHHmmss")}`;

    cb(null, `${fileName}.${extension}`);
  },
});

const upload = multer({
  storage: multerStorage,
}).single("photo");

exports.getAllImages = async (req, res, next) => {
  const data = await ImageMetadata.find();

  return res.status(200).json({
    status: "success",
    data: data,
  });
};

exports.createImageMetadata = async (req, res, next) => {
  return upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        status: "fail",
        message: "file input"
      });
    }

    const doc = await ImageMetadata.create({
      name: req.body.name,
      path: `/img/${req.file.filename}`
    });
  
    if (!doc) {
      return res.status(400).json({
        status: "fail",
        message: "db input"
      });
    }
  
    return res.status(201).json({
      status: "success",
      data: doc
    });
  });
};
