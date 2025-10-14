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

// Controller to process image and save metadata
exports.createImageMetadata = async (req, res, next) => {
  // const doc = await ImageMetadata.create({
  //   name: req.body.name,
  //   path: `/img/${req.file.filename}`,
  // });

  // if (!doc) {
  //   return res.status(400).json({
  //     status: "fail",
  //     message: "invalid input",
  //   });
  // }

  // return res.status(201).json({
  //   status: "success",
  //   data: {
  //     data: doc,
  //   },
  // });


  try {
    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "No file uploaded",
      });
    }
    // Validate file type
    if (
      req.file.mimetype !== "image/jpeg" &&
      req.file.mimetype !== "image/png"
    ) {
      console.log("not right type")
      return res.status(400).json({
        status: "fail",
        message: "Only JPEG and PNG images are allowed",
      });
    }
    // Get file extension
    const extension = req.file.mimetype.split("/")[1];

    // Format filename using utility
    const newFileName = formatFileName(req.body.name, extension);

    // Full path to save the image
    const outputPath = path.join(IMG_DIRECTORY_PATH, newFileName);

    // Resize to 400x400 and save using Sharp
    await sharp(req.file.buffer)
      .resize(400, 400)
      .toFile(outputPath);

    // Save metadata in MongoDB
    const doc = await ImageMetadata.create({
      name: req.body.name,
      path: `/img/${newFileName}`,
    });

    return res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while processing the image",
    });
  }
};
