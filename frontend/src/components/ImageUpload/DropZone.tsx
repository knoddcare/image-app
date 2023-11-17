import PhotoIcon from "../icons/PhotoIcon";
import { useDropzone } from "react-dropzone";

const style = {
  width: "100%",
  height: "100%",
  padding: "30px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
} as const;

export interface DropZoneProps {
  onDrop: (files: File[]) => void;
}

function DropZone({ onDrop }: DropZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    onDrop,
  });

  const label = isDragActive
    ? "Drop the photo here!"
    : "Drag your photo here, or click to select a file.";

  return (
    <div {...getRootProps({ style })}>
      <input {...getInputProps()} />
      <PhotoIcon
        width={140}
        height={140}
        color={isDragActive ? "#ffffffa0" : "#ffffff30"}
      />
      <p>{label}</p>
    </div>
  );
}

export default DropZone;
