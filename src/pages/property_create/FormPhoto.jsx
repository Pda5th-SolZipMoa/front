import React from 'react';
import { Form, Image, Button } from 'react-bootstrap';

export const PropertyPhoto = ({ images, setImages }) => {
  const handleImageChange = (e, index) => {
    const newImages = [...images];
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages[index] = reader.result;
        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageField = () => {
    if (images.length < 3) {
      setImages([...images, null]);
    }
  };

  return (
    <Form.Group className="mb-4">
      <Form.Label>건물 사진</Form.Label>
      <div className="d-flex flex-wrap gap-3">
        {images.map((image, index) => (
          <div key={index} className="position-relative" style={{ width: '200px', height: '200px' }}>
            {image ? (
              <Image 
                src={image} 
                alt={`Building ${index + 1}`} 
                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
              />
            ) : (
              <div 
                className="d-flex justify-content-center align-items-center border"
                style={{ width: '200px', height: '200px', cursor: 'pointer' }}
                onClick={() => document.getElementById(`image-input-${index}`).click()}
              >
                <span>+</span>
              </div>
            )}
            <Form.Control
              id={`image-input-${index}`}
              type="file"
              className="d-none"
              accept="image/*"
              onChange={(e) => handleImageChange(e, index)}
            />
          </div>
        ))}
        {images.length < 3 && (
          <Button 
            variant="outline-secondary" 
            onClick={addImageField}
            style={{ width: '200px', height: '200px' }}
          >
            + 이미지 추가
          </Button>
        )}
      </div>
      <Form.Text className="text-muted">
        최대 3장까지 업로드가능합니다.
      </Form.Text>
    </Form.Group>
  );
};

