import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import DisplayComponent from './Display';
import UploadComponent from './Upload';

const _imagesUri = 'http://localhost:3002/images';

const ImagesContainer = styled.div`
`;

const Images = () => {
  const initialLoad = useRef(false);
  const [images, updateImages] = useState([]);

  const fetchImages = async () => {
    const res = await fetch(_imagesUri);
    const imageResponse = await res.json();

    updateImages(prev => prev.concat(imageResponse.data));
  };

  useEffect(() => {
    if (initialLoad.current) return;

    initialLoad.current = true;
    
    fetchImages()
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <ImagesContainer>
      <div>
        <p>Upload image:</p>
        <UploadComponent />
      </div>
      <div>
        <p>Existing images:</p>
        {images.map((image, index) => <DisplayComponent key={`image-${index}`} image={image} />)}
      </div>
    </ImagesContainer>
  );
};

export default Images;