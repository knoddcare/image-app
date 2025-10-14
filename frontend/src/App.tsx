import { useState, useRef } from "react";
import "./App.css";

function App() {

  // State for the image name
  const [name, setName] = useState("");
  // State for the selected image file
  const [file, setFile] = useState<File | null>(null);
  // State for error message
  const [error, setError] = useState("");
  // State for image preview
  const [preview, setPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = ["image/jpeg", "image/png"];

  const resetFileInput = () => {
    setFile(null);
    setPreview(null);
    setName("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const setSelectedFile = e.target.files[0];
      setFile(setSelectedFile);
      setError("");
      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(setSelectedFile);
      setPreview(previewUrl);

    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) {
      setError("Please provide a file and a name");
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPEG and PNG files are allowed");
      return;
    }

    // Create a FormData object to send file + name
    const formData = new FormData();
    formData.append("name", name);
    formData.append("photo", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/images`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong during upload");
        return;
      }
      alert("Upload successful!");

      // Clear error on success
      resetFileInput()

    } catch (err: any) {
      console.error(err);
      setError("Something went wrong during upload")
    }
  };

  return (
    <div className="app-container">
      <h1>Image Uploading App</h1>
      {preview && (
        <div className="image-preview">
          <p>Preview:</p>
          <img src={preview} alt="Selected file preview" />
        </div>
      )}
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="image-name">Image Name:</label>
          <input
            id="image-name"
            type="text"
            value={name}
            onChange={handleNameChange}
            required
            placeholder="Enter image name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image-file">Choose Image:</label>
          <input
            ref={fileInputRef}
            id="image-file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          <small className="file-note">Only JPEG and PNG files are accepted.</small>
        </div>

        <button type="submit" className="upload-button">
          Upload
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
