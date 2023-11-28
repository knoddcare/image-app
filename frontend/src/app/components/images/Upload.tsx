import { useState } from "react";
import styled from "styled-components";
import { Image } from '../../models/image';

const _imagesUri = 'http://localhost:3002/images';

const UploadContainer = styled.div`

  .fileName, .fileUpload {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
  }
`;

type Props = {
  upploadCallback: (image: Image) => void
}

const Upload = ({ upploadCallback }: Props) => {
  const [file, setFile] = useState<File | null>();
  const [fileName, setFileName] = useState<string>();

  const upload = async () => {
    try {
      if (!file) return;

      await uploadFile();
      console.info('file uploaded successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append('name', fileName ?? file!.name);  
    formData.append('photo', file! as Blob);
    
    const res = await fetch(_imagesUri,
    { 
      method: 'POST',
      body: formData
    });

    const uploadResult = await res.json();
    upploadCallback(uploadResult.data);
  };

  return (
    <UploadContainer>
      <div className="fileName">
        <label>File name:</label>
        <input type="text" id="inputFileName" onChange={(e) => setFileName(e.target.value)}></input>
      </div>
      <div className="fileUpload">
        <input type="file" onChange={(e) => setFile(e.target.files?.[0]) }/>
        <button type="submit" disabled={!file} onClick={upload}>Upload</button>
      </div>
    </UploadContainer>
  );
};

export default Upload;