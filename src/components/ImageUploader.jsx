import React from 'react';

const ImageUploader = ({ onImageUpload }) => {
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='image-uploader'>
      <h2>Subir imagen</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
    </div>
  );
};

export default ImageUploader;
