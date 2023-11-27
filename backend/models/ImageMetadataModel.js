const mongoose = require("mongoose");

const imageMetadataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    path: {
      type: String,
    },
    physicalPath: {
      type: String,
    }
  },
  { collection: "imageMetadata" }
);

const ImageMetadata = mongoose.model("ImageMetadata", imageMetadataSchema);

module.exports = ImageMetadata;
