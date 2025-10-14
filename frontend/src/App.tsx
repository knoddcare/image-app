import { useState } from "react";
import "./App.css";

function App() {



  // State for the image name
  const [name, setName] = useState("");

  // State for the selected image file
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
  };

  return (
    <div className="app-container">
      <h1>Image Uploading App</h1>
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
            id="image-file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit" className="upload-button">
          Upload
        </button>
      </form>
    </div>
  );
}

export default App;
