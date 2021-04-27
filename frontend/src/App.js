import React from "react";
import "./App.css";
import { FileUploader } from "./file-uploader/file-uploader.component";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Uploading App</h1>
      </header>
      <FileUploader></FileUploader>
    </div>
  );
}

export default App;
