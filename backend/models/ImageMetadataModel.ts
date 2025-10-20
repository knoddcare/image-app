import mongoose, { Document, Schema } from "mongoose";

export interface IImageMetadata extends Document {
  name: string;
  path: string;
}

const imageMetadataSchema = new Schema<IImageMetadata>(
  {
    name: {
      type: String,
    },
    path: {
      type: String,
    },
  },
  { collection: "imageMetadata" }
);

const ImageMetadata = mongoose.model<IImageMetadata>(
  "ImageMetadata",
  imageMetadataSchema
);

export default ImageMetadata;
