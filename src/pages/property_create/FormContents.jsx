import React, { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { PropertyInput } from './FormInput';
const VITE_KAKAO_MAP_KEY_RESTAPI = import.meta.env.VITE_KAKAO_MAP_KEY_RESTAPI;

export const PropertyContents = ({ formData, setFormData }) => {
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [hasBuildingInfo, setHasBuildingInfo] = useState(false);
  const fileInputRef = useRef(null); // 파일 입력 필드 참조

  // 스크립트 로드 함수
  const loadKakaoScript = () => {
    if (!document.getElementById('kakao-postcode-script')) {
      const script = document.createElement('script');
      script.id = 'kakao-postcode-script';
      script.src =
        'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
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
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
          address
        )}`,
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

        const b_code = addr?.b_code || '0000000000';
        const main_address_no = addr?.main_address_no || '';
        const sub_address_no = addr?.sub_address_no || '';
        const main_address_no_padded = main_address_no.padStart(4, '0');
        const sub_address_no_padded = sub_address_no.padStart(4, '0');

        const building_code = `${b_code}0${main_address_no_padded}${sub_address_no_padded}`;

        setFormData((prev) => ({
          ...prev,
          lat: y,
          lng: x,
          building_code: building_code,
        }));
        // 빌딩 코드 확인 함수 호출
        await checkBuildingInfo(building_code);
      } else {
        console.error('결과가 없습니다.');
      }
    } catch (error) {
      console.error('API 호출 에러:', error);
    }
  };
  // DB에서 빌딩 코드 확인 함수
  const checkBuildingInfo = async (building_code) => {
    try {
      const response = await fetch(
        `/api/properties/check?building_code=${building_code}`
      );
      if (!response.ok) {
        throw new Error('DB 확인 실패');
      }

      const result = await response.json();
      setHasBuildingInfo(result.exists);

      // 빌딩 정보가 있으면 이미지 삭제
      if (result.exists) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          property_photo: null, // 이미지 삭제
        }));
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // 입력 필드 초기화
        }
        alert(
          '이미 등록된 건물입니다. 기존 이미지가 삭제되고 업로드가 비활성화됩니다.'
        );
      }
    } catch (error) {
      console.error('빌딩 코드 확인 에러:', error);
      setHasBuildingInfo(false);
    }
  };

  const handleAddressClick = () => {
    if (!window.daum || !window.daum.Postcode) {
      console.error('Kakao API script is not loaded');
      return;
    }
    setIsAddressOpen(true);
    new window.daum.Postcode({
      oncomplete: function (data) {
        setFormData({ ...formData, address: data.address });
        setIsAddressOpen(false);
        fetchCoordinates(data.address);
      },
      onclose: function () {
        setIsAddressOpen(false);
      },
    }).open();
  };

  // 메인 건물 사진 변경 핸들러
  const handlePropertyPhotoChange = (e) => {
    if (hasBuildingInfo) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        property_photo: null, // 이미지 삭제
      }));
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // 입력 필드 초기화
      }
      alert('이미 등록된 건물입니다. 사진 업로드가 비활성화되었습니다.');
      return;
    }

    const file = e.target.files[0];
    if (file) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        property_photo: file,
      }));
    }
  };

  return (
    <div className="mb-4">
      <PropertyInput
        label="건물명"
        placeholder="건물의 이름을 입력하세요"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />

      <PropertyInput
        label="주소"
        placeholder="건물의 정확한 주소를 입력하세요"
        value={formData.address}
        onClick={handleAddressClick}
        readOnly
      />

      <PropertyInput
        label="층수"
        placeholder="층수를 입력하세요"
        value={formData.detail_floor}
        onChange={(e) =>
          setFormData({ ...formData, detail_floor: e.target.value })
        }
      />

      <PropertyInput
        label="방 개수"
        placeholder="방 개수를 입력하세요"
        value={formData.room_cnt}
        onChange={(e) => setFormData({ ...formData, room_cnt: e.target.value })}
      />

      <PropertyInput
        label="집 평수"
        placeholder="집 평수를 입력하세요"
        value={formData.home_size}
        onChange={(e) =>
          setFormData({ ...formData, home_size: e.target.value })
        }
      />

      <PropertyInput
        label="유지비"
        placeholder="유지비를 입력하세요"
        value={formData.maintenance_cost}
        onChange={(e) =>
          setFormData({ ...formData, maintenance_cost: e.target.value })
        }
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
        <Col></Col>
      </Row>
      {/* 메인 건물 사진 업로드 */}
      <div className="mb-3">
        <label htmlFor="propertyPhoto">메인 건물 사진</label>
        <input
          type="file"
          id="propertyPhoto"
          accept="image/*"
          ref={fileInputRef} // 파일 입력 필드 참조 추가
          onChange={handlePropertyPhotoChange}
          disabled={hasBuildingInfo} // 빌딩 정보가 있으면 비활성화
        />
        {hasBuildingInfo && (
          <small className="text-muted">
            이미 등록된 건물입니다. 사진 업로드가 비활성화되었습니다.
          </small>
        )}
      </div>
    </div>
  );
};
