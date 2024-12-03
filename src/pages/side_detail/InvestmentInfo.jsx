import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';

function InvestmentInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const { buildingData } = location.state || {};

  const listings = buildingData?.['건물정보']['매물목록'] || [];

  const handleInvestClick = (id) => {
    // 해당 ID로 URL 이동
    navigate(`/property/${id}/trade`);
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="fw-bold mb-4">최근 거래된 매물</h5>
        {listings.length > 0 ? (
          <div className="table-responsive">
            <Table className="table-bordered text-center rounded-3 shadow-sm" style={{ overflow: 'hidden' }}>
              <thead className="bg-light text-dark">
                <tr>
                  <th>층수</th>
                  <th>유지비</th>
                  <th>집 평수</th>
                  <th>투자하기</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing, index) => (
                  <tr key={index}>
                    <td className="align-middle">{listing['층수']}층</td>
                    <td className="align-middle">{listing['유지비']}만원</td>
                    <td className="align-middle">{listing['집 평수']}평</td>
                    <td className="align-middle">
                      <Button
                        variant="purple"
                        size="sm"
                        onClick={() => handleInvestClick(listing['id'])}
                      >
                        투자하기
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <p className="text-muted text-center">매물 정보가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default InvestmentInfo;
