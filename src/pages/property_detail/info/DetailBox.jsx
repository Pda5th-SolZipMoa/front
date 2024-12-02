import React from 'react';
import { Button } from 'react-bootstrap';
import { ChevronDown } from 'lucide-react';

export default function DetailBox({ buildingData, selectedDetail }) {
  if (!buildingData) {
    return <div>로딩 중...</div>;
  }

  // 필요한 데이터 추출
  const buildingInfo = buildingData['건물정보'];
  const buildingName = buildingInfo['건물명'] || '건물명 없음';

  // 제목 생성
  let title = buildingName;
  if (selectedDetail) {
    title += ` - ${selectedDetail['집 평수']}평/${selectedDetail['층수']}층`;
  } else {
    title += ' - 매물 정보 없음';
  }

  // 실제 데이터에서 필요한 정보 가져오기
  const publicOfferingAmount = buildingInfo['공모금액'] || '데이터 없음'; // 필요에 따라 백엔드에서 추가
  const subscriptionPeriod = buildingInfo['청약기간'] || '데이터 없음';   // 필요에 따라 백엔드에서 추가
  const remainingPrice = buildingInfo['잔여가'] || '데이터 없음';        // 필요에 따라 백엔드에서 추가

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h5 className="mb-3">{title}</h5>
      <div className="bg-success-subtle p-2 rounded mb-3">
        <small className="text-success">~ 한 좌대 6% 배당률 예상</small>
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
