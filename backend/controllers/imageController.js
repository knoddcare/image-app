const { fail } = require('assert');
const fs = require('fs');
const multer = require("multer");
const sharp = require('sharp');
const ImageMetadata = require("../models/ImageMetadataModel");

const IMG_DIRECTORY_PATH = "public/img";

const formatFileName = (fn) => {
  const pad = (t) => ('' + t).padStart(2, '0');

  const date = new Date();
  return fn.toLowerCase()
    .substr(0,10)
    .replace(/\s+/g,'-')
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o') +
    date.getFullYear() +
    pad(1 + date.getMonth()) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds());
}

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMG_DIRECTORY_PATH);
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    const filename = formatFileName(file.originalname);
    cb(null, `${filename}.${extension}`);
  },
});

const imageFileFilter = (req, file, cb) => {
  cb(null, file.mimetype === 'image/jpeg' || 
           file.mimetype === 'image/png');
}

const upload = multer({
  fileFilter: imageFileFilter,
  storage: multerStorage,
});

exports.getAllImages = async (req, res, next) => {
  const data = await ImageMetadata.find();

  return res.status(200).json({
    status: "success",
    data: data,
  });
};

exports.uploadImage = upload.single("photo");

exports.resizeImage = (req, res, next) => {
  if(!req.file) {
    return next();
  }

  const fail = (err) => {
    return res.send(500).json({
      status: "fail",
      message: "Something went wrong when saving your image"
    });
  }
  
  sharp(req.file.path)
    .resize(400, 400)
    .toBuffer((err, buf) => {
      
      if (err) {
        return fail();
      }
      fs.writeFile(req.file.path, buf, (error, sharp) => {
        if(error) {
          return fail();
        }

        return next();
      });
    });
}

exports.createImageMetadata = async (req, res, next) => {
  
  if (req.file == null) {
    return res.status(415).json({
      status: "fail",
      message: "Image must be PNG or JPEG"
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
