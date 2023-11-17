import "./ImageUpload.css";
import DropZone from "./ImageUpload/DropZone";
import ErrorIcon from "./icons/ErrorIcon";
import Preview from "./ImageUpload/Preview";
import ProgressBar from "./ImageUpload/ProgressBar";
import SuccessIcon from "./icons/SuccessIcon";
import toast from "react-hot-toast";
import { LifecycleStage, useImageUpload } from "../hooks/useImageUpload";
import { useEffect } from "react";

export interface ImageUploadProps {
  onSuccess: () => void;
}

function ImageUpload({ onSuccess }: ImageUploadProps) {
  const { lifecycleStage, imageUrl, uploadProgress, upload, reset, setImage } =
    useImageUpload();

  useEffect(() => {
    if (lifecycleStage === LifecycleStage.Success) {
      toast.success("Image uploaded successfully.", {
        position: "bottom-center",
      });
      onSuccess();
    }
  }, [lifecycleStage]);

  const handleDrop = (files: File[]) => {
    if (files.length === 1) {
      setImage(files[0]);
    } else {
      toast.error("Invalid file format: Supported formats are JPEG and PNG.", {
        position: "bottom-center",
      });
    }
  };

  return (
    <div
      className={`image-uploader upload-${lifecycleStage
        .toLowerCase()
        .replaceAll("_", "-")}`}
      style={{
        borderStyle:
          lifecycleStage === LifecycleStage.SelectFile ? "dashed" : "solid",
      }}
    >
      {(() => {
        switch (lifecycleStage) {
          case LifecycleStage.SelectFile:
            return <DropZone onDrop={handleDrop} />;
          case LifecycleStage.InputName:
            return (
              <Preview imageUrl={imageUrl} onCancel={reset} onUpload={upload} />
            );
          case LifecycleStage.Uploading:
            return <ProgressBar progress={uploadProgress} />;
          case LifecycleStage.Success:
            return (
              <div className="status-screen">
                <SuccessIcon width={180} height={180} color="#53555d" />
                <button className="size-lg" onClick={reset}>
                  Upload another image
                </button>
              </div>
            );
          case LifecycleStage.Error:
            return (
              <div className="status-screen">
                <ErrorIcon width={140} height={140} color="#53555d" />
                <p>Error: Upload failed!</p>
                <button className="size-lg" onClick={reset}>
                  Try again
                </button>
              </div>
            );
        }
      })()}
    </div>
  );
}

export default ImageUpload;
