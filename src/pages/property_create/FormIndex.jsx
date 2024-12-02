import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { PropertyContents } from './FormContents';
import { PropertyPhoto } from './FormPhoto'; // 상세 매물 이미지 컴포넌트 유지
import { PropertyDocs } from './FormDocs';
import 'bootstrap/dist/css/bootstrap.min.css';

const PropertyCreate = () => {
  const [images, setImages] = useState([]); // 상세 매물 이미지를 관리
  const [hasBuildingInfo, setHasBuildingInfo] = useState(false); // 빌딩 코드 존재 여부 상태 추가
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    token_supply: '',
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
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    const requiredFields = [
      'name',
      'address',
      'token_supply',
      'price',
      'building_code',
      'lat',
      'lng',
      'property_photo',
      'legalDocs',
      'legalNotice',
      'detail_floor',
      'home_size',
      'room_cnt',
      'maintenance_cost',
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

  return (
    <Container
      className="py-5"
      style={{ maxWidth: '800px', backgroundColor: '#f8f9ff' }}
    >
      <h2 className="mb-4">부동산 토큰 발행</h2>

      <Form onSubmit={handleSubmit}>
        {/* 메인 건물 정보와 이미지를 입력 */}
        <PropertyContents
          formData={formData}
          setFormData={setFormData}
          setHasBuildingInfo={setHasBuildingInfo} // 빌딩 코드 존재 여부 상태 전달
        />
        {/* 상세 매물 이미지를 입력 */}
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
