import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { PropertyInput } from './FormInput';
const VITE_KAKAO_MAP_KEY_RESTAPI = import.meta.env.VITE_KAKAO_MAP_KEY_RESTAPI;
export const PropertyContents = ({ formData, setFormData }) => {
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  // 스크립트 로드 함수
  const loadKakaoScript = () => {
    if (!document.getElementById('kakao-postcode-script')) {
      const script = document.createElement('script');
      script.id = 'kakao-postcode-script';
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      document.body.appendChild(script);
    }
  };

  // 컴포넌트 마운트 시 스크립트 로드
  useEffect(() => {
    loadKakaoScript();
  }, []);

  // 주소 검색 완료 후 위도/경도를 가져오는 함수
  const fetchCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
        {
          headers: {
            Authorization: `KakaoAK ${VITE_KAKAO_MAP_KEY_RESTAPI}`, // REST API 키 사용
          },
        }
      );
  
      if (!response.ok) {
        console.error('API 호출 실패:', await response.json());
        return;
      }
  
      const data = await response.json();
      if (data.documents && data.documents.length > 0) {
        const { x, y } = data.documents[0];
        console.log('위도:', y, '경도:', x);
      } else {
        console.error('결과가 없습니다.');
      }
    } catch (error) {
      console.error('API 호출 에러:', error);
    }
  };
  
  

  // 주소 검색 함수
  const handleAddressClick = () => {
    if (!window.daum || !window.daum.Postcode) {
      console.error('Kakao API script is not loaded');
      return;
    }
    setIsAddressOpen(true);
    new window.daum.Postcode({
      oncomplete: function (data) {
        // 주소 데이터를 가져오면 formData 업데이트
        setFormData({ ...formData, address: data.address });
        setIsAddressOpen(false);

        // 주소 검색 완료 후 실행할 작업
        fetchCoordinates(data.address); // 위도/경도 가져오기
      },
      onclose: function () {
        setIsAddressOpen(false); // 모달 닫기 시 상태 업데이트
      },
    }).open();
  };

  return (
    <div className="mb-4">
      <PropertyInput
        label="건물명"
        placeholder="건물의 이름을 입력하세요"
        value={formData.buildingName}
        onChange={(e) =>
          setFormData({ ...formData, buildingName: e.target.value })
        }
      />

      <PropertyInput
        label="주소"
        placeholder="건물의 정확한 주소를 입력하세요"
        value={formData.address}
        onClick={handleAddressClick} // 클릭 시 API 호출
        readOnly // 텍스트 필드 직접 입력 방지
      />

      <Row>
        <Col>
          <PropertyInput
            label="현재 시세"
            type="number"
            placeholder="500"
            value={formData.currentPrice}
            onChange={(e) =>
              setFormData({ ...formData, currentPrice: e.target.value })
            }
            suffix="만원"
          />
        </Col>
        <Col>
          <PropertyInput
            label="발행수량"
            type="number"
            placeholder="100"
            value={formData.totalSupply}
            onChange={(e) =>
              setFormData({ ...formData, totalSupply: e.target.value })
            }
            suffix="개"
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <PropertyInput
            label="토큰 당 가격"
            type="number"
            placeholder="5"
            value={formData.tokenPrice}
            onChange={(e) =>
              setFormData({ ...formData, tokenPrice: e.target.value })
            }
            suffix="만원"
          />
        </Col>
        <Col>
          <PropertyInput
            label="유통 가능 물량"
            type="number"
            placeholder="30"
            value={formData.availableTokens}
            onChange={(e) =>
              setFormData({ ...formData, availableTokens: e.target.value })
            }
            suffix="개"
          />
        </Col>
      </Row>
    </div>
  );
};
