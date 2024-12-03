import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';
import { PropertyInput } from './FormInput';

const VITE_KAKAO_MAP_KEY_RESTAPI = import.meta.env.VITE_KAKAO_MAP_KEY_RESTAPI;

export const PropertyContents = ({ formData, setFormData }) => {
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [hasBuildingInfo, setHasBuildingInfo] = useState(false);
  const fileInputRef = useRef(null);

  const loadKakaoScript = () => {
    if (!document.getElementById('kakao-postcode-script')) {
      const script = document.createElement('script');
      script.id = 'kakao-postcode-script';
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      document.body.appendChild(script);
    }
  };

  useEffect(() => {
    loadKakaoScript();
  }, []);

  const fetchCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
        {
          headers: {
            Authorization: `KakaoAK ${VITE_KAKAO_MAP_KEY_RESTAPI}`,
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
        console.log(addr)        
        const b_code = addr?.b_code || '0000000000';
        const main_address_no = addr?.main_address_no || '';
        const sub_address_no = addr?.sub_address_no || '';
        const main_address_no_padded = main_address_no.padStart(4, '0');
        const sub_address_no_padded = sub_address_no.padStart(4, '0');
        const building_code = `${b_code}0${main_address_no_padded}${sub_address_no_padded}`;
        console.log(building_code)
        setFormData((prev) => ({
          ...prev,
          lat: y,
          lng: x,
          building_code: building_code,
        }));
        await checkBuildingInfo(building_code);
      }
    } catch (error) {
      console.error('API 호출 에러:', error);
    }
  };

  const checkBuildingInfo = async (building_code) => {
    try {
      const response = await fetch(`/api/properties/check?building_code=${building_code}`);
      if (!response.ok) {
        throw new Error('DB 확인 실패');
      }

      const result = await response.json();
      setHasBuildingInfo(result.exists);

      if (result.exists) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          property_photo: null,
        }));
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // alert('이미 등록된 건물입니다. 기존 이미지가 삭제되고 업로드가 비활성화됩니다.');
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

  const handlePropertyPhotoChange = (e) => {
    if (hasBuildingInfo) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        property_photo: null,
      }));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
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
    <Card className="mb-4 border-0 bg-light">
      <Card.Body>
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
          onClick={handleAddressClick}
          readOnly
        />

        <PropertyInput
          label="매매 거래가"
          type="number"
          placeholder="500"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
          suffix="만원"
        />

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

        <PropertyInput
          label="토큰 당 가격"
          type="number"
          placeholder="100"
          value={formData.token_cost}
          onChange={(e) =>
            setFormData({ ...formData, token_cost: e.target.value })
          }
          suffix="만원"
        />

        <PropertyInput
          label="기간 설정"
          placeholder="20241130 ~ 20241225"
          value={formData.period}
          onChange={(e) =>
            setFormData({ ...formData, period: e.target.value })
          }
        />

        <div className="mb-3">
          <label htmlFor="propertyPhoto" className="form-label">메인 건물 사진</label>
          <input
            type="file"
            className="form-control"
            id="propertyPhoto"
            accept="image/*"
            ref={fileInputRef}
            onChange={handlePropertyPhotoChange}
            disabled={hasBuildingInfo}
          />
          {hasBuildingInfo && (
            <small className="text-muted d-block mt-2">
              이미 등록된 건물입니다. 사진 업로드가 비활성화되었습니다.
            </small>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};
