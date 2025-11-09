import "./Upload.css";
import Input from "../Form/Input/Input";
import File from "../Form/File/File";
import { useState } from "react";

export default function Upload() {

  const [showNameField, setShowNameField] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const { method, action } = event.currentTarget;

    if (event.currentTarget.checkValidity()) {
      try {
        const response = await fetch(action, {
          method: method,
          body: formData,
        });

        const { status } = await response.json();

        if (status === "success") {
          console.log("Image uploaded successfully");
          setImageUploaded(true);
        } 
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
  };

  return (
    <div className="upload">
      {!imageUploaded ? (
        <form
          method="POST" 
          action="http://localhost:3002/images"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <File
            name="photo"
            label="Choose Image"
            accept="image/*"
            required={true}
            onChange={(e) => {
            console.log(e)
              setShowNameField(e.target.value.length > 0);
            }}
          />
          {showNameField && <Input name="name" label="Name your image" required={true} />}
          <button className="primary-button">Upload Image</button>
        </form>
      ) : (
        <div className="success-message">Image uploaded successfully!</div>
      )}
    </div>
  )
}