import React, { useState } from 'react';
import { Container, Form, Button, Card, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    created_at: '',
    price: '',
    // owner_id: '',
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
    token_supply: '',
    token_cost: '',
    // period: '',
  });

  const getProvider = async () => {
    if (!window.ethereum) {
      alert('MetaMask가 설치되어 있지 않습니다.');
      return null;
    }
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    return new ethers.BrowserProvider(window.ethereum);
  };

  // 토큰 발행 함수
  const mintToken = async () => {
    try {
      const { token_supply, building_code, detail_floor } = formData;
      const provider = await getProvider();
      if (!provider) return;
      console.log(building_code);

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        myToken.abi,
        signer
      );

      const tx = await contract.mintToken(
        parseInt(token_supply, 10),
        building_code,
        parseInt(detail_floor, 10),
        {
          gasLimit: 500000,
        }
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
      // FormData 초기화
      const data = new FormData();
      const requiredFields = [
        'name',
        'address',
        'token_supply',
        'token_cost',
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
        // 'period',
      ];

      // FormData에 필수 필드 추가
      for (const key of requiredFields) {
        if (key === 'legalNotice') {
          data.append(key, formData[key] ? 'true' : 'false');
        } else if (formData[key]) {
          data.append(key, formData[key]);
        }
      }

      // 이미지 추가
      images.forEach((image) => {
        if (image) {
          data.append('images', image);
        }
      });

      // 서버에 데이터 전송
      const response = await fetch('/api/apartments/token', {
        method: 'POST',
        body: data,
      });

      // 응답 상태 확인
      if (!response.ok) {
        const errorData = await response.json();
        console.error('서버 응답 오류:', errorData);
        throw new Error(
          `서버 오류: ${errorData.message || response.statusText}`
        );
      }

      // 서버 응답 처리
      const result = await response.json();
      await mintToken();

      alert('토큰 발행 성공!');
      navigate(`/main`);
    } catch (error) {
      // 에러 상세 출력
      console.error('오류 발생:', error);

      // 에러 유형별 사용자 메시지 표시
      if (error.name === 'TypeError') {
        alert('네트워크 오류가 발생했습니다. 인터넷 연결을 확인하세요.');
      } else if (error.message.startsWith('서버 오류:')) {
        alert(`서버에서 처리 중 오류가 발생했습니다: ${error.message}`);
      } else {
        alert('알 수 없는 오류가 발생했습니다. 다시 시도하세요.');
      }
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

  // 현재 페이지의 필수 입력 필드가 모두 채워졌는지 확인하는 함수
  const isCurrentPageValid = () => {
    if (currentPage === 1) {
      const requiredFields = [
        'name',
        'address',
        'token_supply',
        'token_cost',
        'price',
      ];
      for (let field of requiredFields) {
        if (
          !formData[field] ||
          (typeof formData[field] === 'string' && formData[field].trim() === '')
        ) {
          return false;
        }
      }
      return true;
    } else if (currentPage === 2) {
      const requiredFields = [
        'detail_floor',
        'home_size',
        'room_cnt',
        'maintenance_cost',
      ];
      for (let field of requiredFields) {
        if (
          !formData[field] ||
          (typeof formData[field] === 'string' && formData[field].trim() === '')
        ) {
          return false;
        }
      }
      return true;
    } else if (currentPage === 3) {
      if (!formData['legalDocs']) {
        return false;
      }
      if (!formData['legalNotice']) {
        return false;
      }
      return true;
    }
    return true;
  };

  return (
    <div>
      <Header />

      <Container className="py-4" style={{ maxWidth: '800px' }}>
        {/* <Card className="shadow-sm"> */}
          <Card.Body className="p-5">
            <h2
              className="text-center mb-4"
              style={{ color: '#6c63ff', fontWeight: '600' }}
            >
              부동산 토큰 발행
            </h2>

            <ProgressBar

            now={(currentPage / 3) * 100}
            className="mb-4"
            style={{
              backgroundColor: '#F3F0FF',
            }}
            >
            <div
              style={{
              width: `${(currentPage / 3) * 100}%`,
              height: '100%',
              backgroundColor: '#6c63ff',
              borderRadius: '4px',
              }}
            ></div>
            </ProgressBar>
            <Form
              onSubmit={handleSubmit}
              className="mx-auto"
              style={{ maxWidth: '700px' }}
            >
              {currentPage === 1 && (
                <PropertyContents
                  formData={formData}
                  setFormData={setFormData}
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
                  <PropertyDocs
                    formData={formData}
                    setFormData={setFormData}
                  />
                  <Form.Group className="mb-4">
                    <div className="d-flex align-items-center gap-2">
                      <Form.Check
                        type="checkbox"
                        id="legalNotice"
                        checked={formData.legalNotice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            legalNotice: e.target.checked,
                          })
                        }
                      />
                      <Form.Label
                        htmlFor="legalNotice"
                        className="mb-0"
                        style={{ color: '#495057' }}
                      >
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
                      backgroundColor: '#6c63ff',
                      borderColor: '#6c63ff',
                    }}
                    disabled={!isCurrentPageValid()} // 여기에 disabled 속성 추가
                  >
                    다음
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    type="submit"
                    className="px-4 py-2 ms-auto"
                    disabled={!isCurrentPageValid()} // 여기에 disabled 속성 추가
                    style={{
                      backgroundColor: '#7950f2',
                      borderColor: '#7950f2',
                    }}
                  >
                    토큰 발행 신청
                  </Button>
                )}
              </div>
            </Form>
          </Card.Body>
        {/* </Card> */}
      </Container>
    </div>
  );
};

export default PropertyCreate;