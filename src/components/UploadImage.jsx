import React from 'react';
import axios from 'axios';
import { url } from './CardSetupForm';

const UploadImage = ({ setDocRef, setUploadedImage }) => {
  const handleImageChange = async (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    
    const { data: { data } } = await axios.post(`${url}/quote/upload`, formData);
    console.log('UPLOAD DATA: ', data);
    setDocRef(data.doc);
    setUploadedImage(data.uploadedImage);
  }

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
    </div>
  )
}

export default UploadImage
