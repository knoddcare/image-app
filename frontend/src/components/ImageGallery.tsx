import "./ImageGallery.css";
import PulseLoader from "react-spinners/PulseLoader";
import { Gallery } from "react-grid-gallery";
import type { Image } from "react-grid-gallery";

export interface ImageGalleryProps {
  images: Image[];
  fetchImages: () => void;
  isFetching: boolean;
  error: boolean;
}

function ImageGallery({
  images,
  fetchImages,
  isFetching,
  error,
}: ImageGalleryProps) {
  return (
    <div className="image-gallery">
      {isFetching ? (
        <div>
          <PulseLoader color="#ffffff" />
        </div>
      ) : error ? (
        <div>
          <p>Failed loading images.</p>
          <button onClick={fetchImages}>Try again!</button>
        </div>
      ) : (
        <Gallery images={images} enableImageSelection={false} />
      )}
    </div>
  );
}

export default ImageGallery;
