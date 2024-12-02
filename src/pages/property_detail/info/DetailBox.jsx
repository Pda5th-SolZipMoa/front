import React from 'react';
import { Button } from 'react-bootstrap';
import { ChevronDown } from 'lucide-react';

export default function DetailBox({ buildingData, selectedDetail }) {
  if (!buildingData || !selectedDetail) {
    return <div>로딩 중...</div>;
  }

  // 건물명
  const buildingName = buildingData['건물정보']['건물명'] || '건물명 없음';

  // 제목 생성
  const title = `${buildingName} - ${selectedDetail['집 평수']}평/${selectedDetail['층수']}층`;

  // 필요한 데이터 추출
  const tokenSupply = selectedDetail['토큰발행'] || 0;
  const tokenCost = selectedDetail['토큰가격'] || 0;
  const publicOfferingAmount = (tokenSupply * tokenCost) || '데이터 없음';
  const subscriptionPeriod = selectedDetail['청약기간'] || '데이터 없음';
  const remainingPrice = buildingData['건물정보']['잔여가'] || '데이터 없음'; // 필요에 따라 수정


  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h5 className="mb-3">{title}</h5>
      <div className="bg-success-subtle p-2 rounded mb-3">
        <small className="text-success">신한투자증권이 발행함.</small>
      </div>
      <div className="mb-3">
        <div className="d-flex justify-content-between mb-2">
          <span>공모금액</span>
          <span className="fw-bold">{publicOfferingAmount}</span>
        </div>
        <div className="d-flex justify-content-between">
          <span>청약기간</span>
          <span>{subscriptionPeriod}</span>
        </div>
      </div>
      <Button className="w-100 mb-3" style={{ backgroundColor: '#6B21A8', borderColor: '#6B21A8' }}>
        청약하기
      </Button>
      <div className="d-flex justify-content-between align-items-center">
        <span>잔여가</span>
        <div>
          <span className="text-primary me-2">{remainingPrice}</span>
          <ChevronDown className="text-muted" />
        </div>
      </div>
    </div>
  );
}
