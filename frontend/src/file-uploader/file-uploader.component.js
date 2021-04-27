import React, { useState } from "react"
import { uploadImage } from "./file-uploader.service";
import './file-uploader.style.css';

export function FileUploader() {
  const [uploadDone, setUploadDone] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  function resetForm() {
    setUploadDone(false);
    setFile(null);
    setFileName('');
    setUploadError('');
  }

  function formIsValid() {
    return file !== null && fileName !== '';
  }

  function upload() {
    uploadImage(file, fileName)
      .catch((errorText) => setUploadError(errorText))
      .finally(() => setUploadDone(true));
  }

  return !uploadDone ? (
    <fieldset className="file-upload__container">
      <legend>Upload your image</legend>
      <input id="name-input" type="text" onChange={(e) => setFileName(e.target.value)} placeholder="Image name" />
      <input id="file-input" type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button id="send-btn" disabled={!formIsValid()} onClick={upload}>Send</button>
    </fieldset>
  ) : 
  (
    <div className="file-upload__card">
      <h3>
        { uploadError !== '' ? 
          'Something went wrong!' :
          'Your image is uploaded!'
        }
      </h3>
      {uploadError !== '' && 
        <p>The image could not be uploaded: <br />
          {uploadError}</p>
      }
      <button onClick={resetForm}>Upload another image</button>
    </div>
  )
}