const multer = require("multer");
const ImageMetadata = require("../models/ImageMetadataModel");
const sharp = require('sharp');

const IMG_DIRECTORY_PATH = "public/img";

const cleanCharacters = (str) => {
  return str.substring(0, 10).replace(/[åäö\s]/g, match => {
    const replacements = {'å': 'a', 'ä': 'a', 'ö': 'o', ' ': '-'};
    return replacements[match] || match;
  });
}
const generateFormattedFilename = (originalName, desiredName) => {
  //TODO: Add more replacements, only handling swedish characters for now
  let formattedName = cleanCharacters(desiredName);
  const timestamp = Date.now();
  const extension = originalName.split('.').pop();
  return `${formattedName}_${timestamp}.${extension}`;
};

//Validate file type
const fileFilter = (req, file, cb) => {
  //Filter only jpeg and png files
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false); 
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
}).single("photo");

exports.getAllImages = async (req, res, next) => {
  const data = await ImageMetadata.find();

  return res.status(200).json({
    status: "success",
    data: data,
  });
};

exports.uploadImage = (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
   
      return res.status(500).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided or file type is not supported' });
    }
    const filename = generateFormattedFilename(req.file.originalname, req.body.name);
    const filePhysicalPath = cleanCharacters(`${req.body.name}`);
    const format = req.file.mimetype === 'image/png' ? 'png' : 'jpeg';

    let sharpProcess = sharp(req.file.buffer).resize(400, 400);
    //TODO: Happy flow, we should validate better
    sharpProcess = format === 'jpeg' ? sharpProcess.toFormat('jpeg').jpeg({ quality: 90 }) : sharpProcess.toFormat('png');

    // Resize image with sharp and save to public/img
    sharpProcess.toFile(`${IMG_DIRECTORY_PATH}/${filename}`, (resizeErr) => {
      if (resizeErr) {
        return res.status(500).json({ error: resizeErr.message });
      }
      
      req.file.physicalPath = `${filePhysicalPath}.${format}`;
      req.file.filename = filename; 
      next();
    });
  });
};

exports.createImageMetadata = async (req, res, next) => {
  const doc = await ImageMetadata.create({
    name: req.body.name,
    physicalPath: `/img/${req.file.filename}`, //we assume the presentational path and physical path are the different, ie blob storage
    path: `/img/${req.file.physicalPath}`,
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
