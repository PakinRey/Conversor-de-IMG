import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ImageDisplay from './components/ImageDisplay';
import './css/index.css';


const App = () => {
  const [imageSrc, setImageSrc] = useState('');

  const handleImageUpload = (src) => {
    setImageSrc(src);
  };

  return (
    <div>
      <ImageUploader onImageUpload={handleImageUpload} />
      <ImageDisplay imageSrc={imageSrc} />
    </div>
  );
};

export default App;