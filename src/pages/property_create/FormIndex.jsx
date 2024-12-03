import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { PropertyContents } from './FormContents';
import { PropertyPhoto } from './FormPhoto'; // 상세 매물 이미지 컴포넌트 유지
import { PropertyDocs } from './FormDocs';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ethers } from 'ethers';
import myToken from '../../hooks/myToken.json';

const contractAddress = import.meta.env.VITE_APP_CONTRACT_ADDRESS;

const PropertyCreate = () => {
  const [images, setImages] = useState([]);
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

  const getProvider = async () => {
    if (!window.ethereum) {
      alert('MetaMask가 설치되어 있지 않습니다.');
      return null;
    }
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    return new ethers.BrowserProvider(window.ethereum);
  };

  const mintToken = async () => {
    try {
      const { token_supply, building_code, detail_floor } = formData;
      const provider = await getProvider();
      if (!provider) return;
      console.log(building_code)

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        myToken.abi,
        signer
      );

      const tx = await contract.mintToken(
        parseInt(token_supply, 10),
        building_code,
        parseInt(detail_floor, 10)
      );

      // 트랜잭션 완료 대기
      const receipt = await tx.wait();
    } catch (error) {
      console.error('토큰 발행 중 오류:', error);
      alert(`오류 발생: ${error.message}`);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 토큰 발행 및 ID 반환
      const tokenId = await mintToken();

      // 서버에 데이터 전송
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

      data.append('token_id', tokenId); // 발행된 토큰 ID 추가

      const response = await fetch('/api/apartments/token', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        alert('토큰 발행 및 데이터 저장 성공!');
        console.log('서버 응답:', result);
      } else {
        const result = await response.json();
        alert(`오류 발생: ${result.detail}`);
        console.error('서버 오류:', result);
      }
    } catch (error) {
      console.error('토큰 발행 및 서버 통신 중 오류:', error);
      alert('오류가 발생했습니다. 다시 시도하세요.');
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
