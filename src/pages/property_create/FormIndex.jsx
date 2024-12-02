import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { PropertyContents } from './FormContents';
import { PropertyPhoto } from './FormPhoto';
import { PropertyDocs } from './FormDocs';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ethers } from 'ethers';
import myToken from '../../hooks/myToken.json';
const contractAddress = import.meta.env.VITE_APP_CONTRACT_ADDRESS;

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
    detail_floor: '',
  });

  const getProvider = async () => {
    if (!window.ethereum) {
      alert('MetaMask가 설치되어 있지 않습니다.');
      return null;
    }
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider;
  };

  const mintToken = async () => {
    const { token_supply, building_code, detail_floor } = formData;
    console.log(token_supply, building_code, detail_floor);

    try {
      const provider = await getProvider();
      if (!provider) return;

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
      await tx.wait();
      alert('토큰 발행 성공!');
    } catch (error) {
      console.error('토큰 발행 중 오류:', error);
      alert(`오류 발생: ${error.message}`);
    }
  };

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
      'detail_floor',
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
      await mintToken();

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
