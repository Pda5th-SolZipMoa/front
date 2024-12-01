import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { PropertyContents } from './FormContents';
import { PropertyPhoto } from './FormPhoto';
import { PropertyDocs } from './FormDocs';
import 'bootstrap/dist/css/bootstrap.min.css';

const PropertyCreate = () => {
  const [images, setImages] = useState([]); // 초기값 수정
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    token_supply: '',
    created_at:'',
    price: '',
    owner_id:'',
    building_code: '',
    platArea:'',
    bcRat:'',
    totArea:'',
    vlRat:'',
    lat: '',
    lng: '',
    legalDocs: '',
    legalNotice: false, 
    detail_floor: '',       // 추가
    home_size: '',          // 추가
    room_cnt: '',           // 추가
    maintenance_cost: '',   // 추가
    
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // FormData 생성
    const data = new FormData();

    // 필요한 필드만 추가
    const requiredFields = [
      'name',
      'address',
      'token_supply',
      'price',
      'building_code',
      'lat',
      'lng',
      'legalDocs',
      'legalNotice',
      'detail_floor',      // 추가
      'home_size',         // 추가
      'room_cnt',          // 추가
      'maintenance_cost',  // 추가
    ];

    for (const key of requiredFields) {
      if (key === 'legalNotice') {
        // Boolean 값 처리
        data.append(key, formData[key] ? 'true' : 'false');
      } else {
        data.append(key, formData[key]);
      }
    }

    // 이미지 추가
    images.forEach((image, index) => {
      if (image) {
        data.append(`images`, image); // 동일한 키 사용
      }
    });

    // 디버깅용: FormData 출력
    for (let pair of data.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    // 서버로 데이터 전송
    try {
      const response = await fetch('http://127.0.0.1:8000/api/apartments/token', {
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
