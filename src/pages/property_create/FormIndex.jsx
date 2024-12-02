import React, { useState } from 'react';
import { Container, Form, Button, Card, ProgressBar } from 'react-bootstrap';
import { PropertyContents } from './FormContents';
import { PropertyDetails } from './FormDetails';
import { PropertyPhoto } from './FormPhoto';
import { PropertyDocs } from './FormDocs';
import 'bootstrap/dist/css/bootstrap.min.css';

const PropertyCreate = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    created_at: '',
    price: '',
    owner_id: '',
    building_code: '',
    platArea: '',
    bcRat: '',
    totArea: '',
    vlRat: '',
    lat: '',
    lng: '',
    property_photo: null,
    legalDocs: null,
    legalNotice: false,
    detail_floor: '',
    home_size: '',
    room_cnt: '',
    maintenance_cost: '',
    token_supply:'',
    token_cost:'',
    period:'',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    const requiredFields = [
      'name', 'address', 'price', 'building_code',
      'lat', 'lng', 'property_photo', 'legalDocs', 'legalNotice',
      'detail_floor', 'home_size', 'room_cnt', 'maintenance_cost',
      'token_supply', 'token_cost','period',
    ];

    for (const key of requiredFields) {
      if (key === 'legalNotice') {
        data.append(key, formData[key] ? 'true' : 'false');
      } else if (formData[key]) {
        data.append(key, formData[key]);
      }
    }

    images.forEach((image) => {
      if (image) {
        data.append('images', image);
      }
    });

    try {
      const response = await fetch('/api/apartments/token', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        alert('토큰 발행 성공!');
        console.log('Response:', result);
      } else {
        alert(`오류 발생: ${result.detail}`);
        console.error('Error:', result);
      }
    } catch (error) {
      console.error('서버 통신 에러:', error);
      alert('서버와의 통신에 문제가 발생했습니다.');
    }
  };

  const nextPage = () => {
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#f8f0ff',
      minHeight: '100vh',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    }}>
      <Container style={{ maxWidth: '800px' }}>
        <Card className="shadow-sm">
          <Card.Body className="p-5">
            <h2 className="text-center mb-4" style={{ color: '#5a287d', fontWeight: '600' }}>
              부동산 토큰 발행
            </h2>
            
            <ProgressBar 
              now={(currentPage / 3) * 100} 
              className="mb-4"
              variant="info"
            />

            <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '700px' }}>
              {currentPage === 1 && (
                <PropertyContents
                  formData={formData}
                  setFormData={setFormData}
                  // setHasBuildingInfo={setHasBuildingInfo}
                />
              )}
              {currentPage === 2 && (
                <>
                  <PropertyDetails
                    formData={formData}
                    setFormData={setFormData}
                  />
                  <PropertyPhoto images={images} setImages={setImages} />
                </>
              )}
              {currentPage === 3 && (
                <>
                  <PropertyDocs formData={formData} setFormData={setFormData} />
                  <Form.Group className="mb-4">
                    <div className="d-flex align-items-center gap-2">
                      <Form.Check
                        type="checkbox"
                        id="legalNotice"
                        checked={formData.legalNotice}
                        onChange={(e) =>
                          setFormData({ ...formData, legalNotice: e.target.checked })
                        }
                      />
                      <Form.Label htmlFor="legalNotice" className="mb-0" style={{ color: '#495057' }}>
                        이용약관에 동의합니다
                      </Form.Label>
                    </div>
                  </Form.Group>
                </>
              )}

              <div className="d-flex justify-content-between mt-5">
                {currentPage > 1 && (
                  <Button
                    variant="secondary"
                    onClick={prevPage}
                    className="px-4 py-2"
                  >
                    이전
                  </Button>
                )}
                {currentPage < 3 ? (
                  <Button
                    variant="primary"
                    onClick={nextPage}
                    className="px-4 py-2 ms-auto"
                    style={{
                      backgroundColor: '#7950f2',
                      borderColor: '#7950f2',
                    }}
                  >
                    다음
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    type="submit"
                    className="px-4 py-2 ms-auto"
                    disabled={!formData.legalNotice}
                    style={{
                      backgroundColor: '#7950f2',
                      borderColor: '#7950f2',
                    }}
                  >
                    토큰 발행 신청하기
                  </Button>
                )}
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default PropertyCreate;
