import React, { useState, DragEvent, ChangeEvent, useRef } from 'react';
import { useModal } from '../context/warningModal';
const FileUpload: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageName, setImageName] = useState<string>('');
    const allowedTypes = ['image/jpeg', 'image/png'];
    const { showModal } = useModal();
    const [uploadedImage, setUploadedImage] = useState<string>('');
    const onFileDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };
    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            //Validate file type before uploading
            if (allowedTypes.includes(file.type)) {
                setSelectedFile(file);
            } else {
                showModal('Upload of file type ' + file.type + ' is not allowed. The file must be a image of type ' + allowedTypes.join(', ') + '.');
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''; // Clear the input
                }
            }

        }
    };

    const onDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile || imageName.trim() === '') {
            //Both fields are required, try to keep it air tight
            return;
        }
        console.log(selectedFile.name);
        // Create an object of formData
        const formData = new FormData();

        //initialy made a booboo here, ensure that imageName is set before file is appended to ensure multer can read the name
        formData.append('name', imageName);
        if (selectedFile) {
            formData.append('photo', selectedFile, selectedFile.name);
        }

        console.log(formData);
        // Request made to the backend api
        fetch('http://localhost:3002/images', {
            method: 'POST',
            body: formData,
        })
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                setSelectedFile(null);
                setImageName('');
                setUploadedImage(`http://localhost:3002/${json.data.data.physicalPath}`);
                setTimeout(() => {
                    setUploadedImage('');
                }, 5000);
            })
            .catch((err) => {
                console.error(err);
                showModal('Something went wrong. Please try again later.');
            });
    };

    return (
        <form onSubmit={onFormSubmit}>
            <div
                onDrop={onFileDrop}
                onDragOver={onDragOver}
                style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}
            >
                Drag and drop a file here OR click here to select a file
                <input
                    name='photo'
                    type="file"
                    onChange={onFileChange}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    accept="image/png, image/jpeg"
                />
            </div>
            <div>
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
            >
                Select file
            </button>
            </div>
            {uploadedImage && (
                <div style={{position:'fixed', top: 0,left:0, width: '100%',height: '100%',backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    <div>Image uploaded</div>
                    <img src={uploadedImage} alt="Uploaded" />
                </div>
            )}
            {selectedFile && (
                <>
                    <p>File: {selectedFile.name}</p>
                    <input
                        type="text"
                        placeholder="Enter name for the image"
                        value={imageName}
                        onChange={(e) => setImageName(e.target.value)}
                        name="name"
                    />
                </>
            )}
            <button type="submit" disabled={!selectedFile || imageName.trim() === ''}>Upload</button>
        </form>
    );
};

export default FileUpload;
