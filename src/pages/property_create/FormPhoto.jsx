import React from 'react';
import { Form, Image, Button } from 'react-bootstrap';

export const PropertyPhoto = ({ images, setImages }) => {
  const handleImageChange = (e, index) => {
    const newImages = [...images];
    const file = e.target.files[0];
    if (file) {
      newImages[index] = file; // File 객체를 상태에 저장
      setImages(newImages);
    }
  };

  const addImageField = () => {
    if (images.length < 3) {
      setImages([...images, null]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1); // 해당 인덱스의 이미지를 제거
    setImages(newImages);
  };

  return (
    <Form.Group className="mb-4">
      <Form.Label>집 사진</Form.Label>
      <div className="d-flex flex-wrap gap-3">
        {images.map((image, index) => (
          <div key={index} className="position-relative" style={{ width: '200px', height: '200px' }}>
            {image ? (
              <Image 
                src={URL.createObjectURL(image)} // File 객체를 미리보기 URL로 변환
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
            <Button 
              variant="danger" 
              size="sm" 
              className="position-absolute top-0 end-0"
              onClick={() => removeImage(index)}
            >
              ×
            </Button>
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
            + 이미지
          </Button>
        )}
      </div>
      <Form.Text className="text-muted">
        최대 3장까지 업로드 가능
      </Form.Text>
    </Form.Group>
  );
};
