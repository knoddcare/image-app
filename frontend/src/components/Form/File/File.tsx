import { useRef, useState } from "react";
import { fileProps } from "../../../types";
import "./File.css";

export default function File({ 
  name,
  label,
  accept,
  onChange,
  required
}: fileProps) {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setCurrentFile(file);
    onChange && onChange(e);
  }

  const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCurrentFile(null);
    if (fileRef.current) {
      fileRef.current.value = "";
      onChange && onChange({ target: fileRef.current } as React.ChangeEvent<HTMLInputElement>);
    }
  }

  return (
    <>
      <label htmlFor={name} className={["upload-button", currentFile ? "file-selected" : ""].join(" ")}>
        <input
          ref={fileRef}
          type="file"
          className="sr-only"
          required={required}
          name={name}
          id={name}
          accept={accept}
          onChange={handleFileChange}
        />
        {label}
      </label>
      {currentFile && (
      <span className="file-name">{currentFile.name}<button onClick={handleRemoveFile}>Remove</button></span>
      )}
    </>
  )
}