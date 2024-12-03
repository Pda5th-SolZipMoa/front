import React from 'react';
import { Rulers, CashCoin, BarChart } from 'react-bootstrap-icons';
import { useLocation } from 'react-router-dom';

function InvestmentInfo() {
  const location = useLocation();
  const { buildingData } = location.state || {};

  const listings = buildingData?.['건물정보']['매물목록'] || [];

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="fw-bold mb-4">최근 거래된 매물 목록</h5>
        {listings.length > 0 ? (
          listings.map((listing, index) => (
            <div key={index} className="mb-3 border-bottom pb-2">
              {/* 가로로 나열된 정보 */}
              <div className="d-flex justify-content-between">
                {/* 층수 */}
                <div className="d-flex gap-2 align-items-center">
                  <BarChart className="text-purple" size={20} />
                  <div>
                    <p className="fw-medium mb-0">층수</p>
                    <p className="small text-muted mb-0">{listing['층수']}층</p>
                  </div>
                </div>

                {/* 유지비 */}
                <div className="d-flex gap-2 align-items-center">
                  <CashCoin className="text-purple" size={20} />
                  <div>
                    <p className="fw-medium mb-0">유지비</p>
                    <p className="small text-muted mb-0">{listing['유지비']}만원</p>
                  </div>
                </div>

                {/* 집 평수 */}
                <div className="d-flex gap-2 align-items-center">
                  <Rulers className="text-purple" size={20} />
                  <div>
                    <p className="fw-medium mb-0">집 평수</p>
                    <p className="small text-muted mb-0">{listing['집 평수']}평</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">매물 정보가 없습니다.</p>
        )}
        <button className="btn btn-purple w-100">투자하기</button>
      </div>
    </div>
  );
}

export default InvestmentInfo;
