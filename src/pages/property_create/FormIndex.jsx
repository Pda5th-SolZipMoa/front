import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { PropertyContents } from './FormContents';
import { PropertyPhoto } from './FormPhoto';
import { PropertyDocs } from './FormDocs';
import 'bootstrap/dist/css/bootstrap.min.css';

const PropertyCreate = () => {
  const [images, setImages] = useState([null]);
  const [formData, setFormData] = useState({
    buildingName: '',
    address: '',
    currentPrice: '',
    totalSupply: '',
    tokenPrice: '',
    availableTokens: '',
    legalDocs: '',
    legalNotice: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    console.log('Images:', images);
  };

  return (
    <Container
      className="py-5"
      style={{ maxWidth: '800px', backgroundColor: '#f8f9ff' }}
    >
      <h2 className="mb-4">부동산 토큰 발행</h2>

      <Form onSubmit={handleSubmit}>
        <PropertyContents formData={formData} setFormData={setFormData} />
        <PropertyPhoto images={images} setImages={setImages} />
        <PropertyDocs formData={formData} setFormData={setFormData} />

        <Form.Group className="mb-4">
          <Form.Check
            type="checkbox"
            label="이용약관에 동의합니다"
            checked={formData.legalNotice}
            onChange={(e) =>
              setFormData({ ...formData, legalNotice: e.target.checked })
            }
          />
        </Form.Group>

        <div className="d-grid">
          <Button
            variant="primary"
            type="submit"
            size="lg"
            disabled={!formData.legalNotice}
            style={{ backgroundColor: '#7950f2', borderColor: '#7950f2' }}
          >
            토큰 발행 신청하기
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default PropertyCreate;
