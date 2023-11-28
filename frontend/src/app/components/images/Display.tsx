import styled from "styled-components";
import { Image } from '../../models/image';

const _imageUri = 'http://localhost:3002';

const DisplayDiv = styled.div`
  img {
    display: block;
    max-width: 500px;
    max-height: 500px;  
  }
`;

type Props = {
  image: Image
};

const Display = ({ image }: Props) => {
  return (
    <DisplayDiv>
      <span>{image.name}</span>
      <img src={`${_imageUri}${image.path}`} />
    </DisplayDiv>
  );
};

export default Display;