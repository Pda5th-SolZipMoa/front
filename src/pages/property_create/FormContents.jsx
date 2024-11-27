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
        const { x, y, address: addr } = data.documents[0];
  
        // 빌딩 코드 규칙에 따라 생성
        const b_code = addr?.b_code || '0000000000'; // 10자리 기본값
        const main_address_no = addr?.main_address_no || ''; // 주 번지
        const sub_address_no = addr?.sub_address_no || ''; // 부 번지
  
        // 4자리 숫자로 맞추기
        const main_address_no_padded = main_address_no.padStart(4, '0'); // 빈 경우 '0000'
        const sub_address_no_padded = sub_address_no.padStart(4, '0'); // 빈 경우 '0000'
  
        // 최종 building_code 생성
        const building_code = `${b_code}0${main_address_no_padded}${sub_address_no_padded}`;
  
        console.log('위도:', y, '경도:', x, 'building_code:', building_code);
  
        // 상태 업데이트
        setFormData((prev) => ({
          ...prev,
          lat: y,
          lng: x,
          building_code: building_code,
        }));
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
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
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
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            suffix="만원"
          />
        </Col>
        <Col>
          <PropertyInput
            label="발행수량"
            type="number"
            placeholder="100"
            value={formData.token_supply}
            onChange={(e) =>
              setFormData({ ...formData, token_supply: e.target.value })
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
