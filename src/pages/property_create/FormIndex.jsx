import React, { useState } from 'react';
import { Container, Form, Button, Card, ProgressBar } from 'react-bootstrap';
import { PropertyContents } from './FormContents';
import { PropertyDetails } from './FormDetails';
import { PropertyPhoto } from './FormPhoto';
import { PropertyDocs } from './FormDocs';
import Header from '../../components/header/Header';

import 'bootstrap/dist/css/bootstrap.min.css';
import { ethers } from 'ethers';
import myToken from '../../hooks/myToken.json';

const contractAddress = import.meta.env.VITE_APP_CONTRACT_ADDRESS;

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
      {/* Header 추가 */}
      <Header
      />

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
