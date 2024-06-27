import React, { useState } from 'react';
import styled from 'styled-components';
import { jsPDF } from 'jspdf';

const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  margin-top: 20px;
`;

const OvalImageContainer = styled.div`
  display: flex;
  width: 400px;
  height: 400px;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  border-radius: 30px;
  border: 1px solid #ccc;
  padding: 10px;
`;

const OvalImage = styled.img`
  width: ${props => props.width};
  height: ${props => props.height};
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
`;

const SizeButton = styled.button`
  margin-top: 10px;
  border-radius: 5px;
  border: none;
  background-color: ${props => (props.selected ? '#ff4d4d' : '#007bff')};
  color: white;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
`;

const DownloadButton = styled.button`
  margin-top: 10px;
  border-radius: 5px;
  border: none;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
`;

const cmToPoints = cm => cm * 28.3465;

const ImageDisplay = ({ imageSrc }) => {
  const [selectedSizes, setSelectedSizes] = useState([]);

  const toggleSelectSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const renderOvalImage = (size) => {
    const img = new Image();
    img.src = imageSrc;

    return new Promise((resolve) => {
      img.onload = () => {
        let width, height;
        if (size === 'large') {
          width = cmToPoints(6);
          height = cmToPoints(9);
        } else if (size === 'medium') {
          width = cmToPoints(3.5);
          height = cmToPoints(5);
        } else {
          width = cmToPoints(5);
          height = cmToPoints(7);
        }

        const canvas = document.createElement('canvas');
        const scaleFactor = 3; // Increase this factor for higher resolution
        canvas.width = width * scaleFactor;
        canvas.height = height * scaleFactor;
        const ctx = canvas.getContext('2d');
        ctx.scale(scaleFactor, scaleFactor);
        ctx.beginPath();
        ctx.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/png'));
      };
    });
  };

  const downloadPDF = async () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter'
    });

    for (const [index, size] of selectedSizes.entries()) {
      const ovalImgSrc = await renderOvalImage(size);
      const img = new Image();
      img.src = ovalImgSrc;

      await new Promise((resolve) => {
        img.onload = () => {
          let x = 72; // 1 inch margin
          let y = 72; // 1 inch margin
          let width, height;
          if (size === 'large') {
            width = cmToPoints(6);
            height = cmToPoints(9);
          } else if (size === 'medium') {
            width = cmToPoints(3.5);
            height = cmToPoints(5);
          } else {
            width = cmToPoints(5);
            height = cmToPoints(7);
          }
          doc.addImage(ovalImgSrc, 'PNG', x, y, width, height);
          if (index < selectedSizes.length - 1) {
            doc.addPage();
          }
          resolve();
        };
      });
    }

    doc.save('images.pdf');
  };

  return (
    <div className='image-display'>
      {imageSrc && (
        <ImageContainer>
          <OvalImageContainer>
            <h2>Imagen 5cm x 7cm "Certificado"</h2>
            <OvalImage src={imageSrc} width="5cm" height="7cm" />
            <SizeButton
              onClick={() => toggleSelectSize('large')}
              selected={selectedSizes.includes('large')}
            >
              {selectedSizes.includes('large') ? 'Quitar' : 'Seleccionar 5cm * 7cm'}
            </SizeButton>
          </OvalImageContainer>
          <OvalImageContainer>
            <h2>Imagen 3.5cm x 5cm "Diploma"</h2>
            <OvalImage src={imageSrc} width="3.5cm" height="5cm" />
            <SizeButton
              onClick={() => toggleSelectSize('medium')}
              selected={selectedSizes.includes('medium')}
            >
              {selectedSizes.includes('medium') ? 'Quitar' : 'Seleccionar 3.5cm * 5cm'}
            </SizeButton>
          </OvalImageContainer>
          <OvalImageContainer>
            <h2>Imagen 6cm x 9cm "Titulo"</h2>
            <OvalImage src={imageSrc} width="6cm" height="9cm" />
            <SizeButton
              onClick={() => toggleSelectSize('small')}
              selected={selectedSizes.includes('small')}
            >
              {selectedSizes.includes('small') ? 'Quitar' : 'Seleccionar 6cm * 9cm'}
            </SizeButton>
          </OvalImageContainer>
        </ImageContainer>
      )}
      {selectedSizes.length > 0 && (
        <DownloadButton className='btn-download' onClick={downloadPDF}>Descargar en PDF</DownloadButton>
      )}
    </div>
  );
};

export default ImageDisplay;
