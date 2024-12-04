import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Table, Button, Card } from 'react-bootstrap';
import { ArrowRight } from 'react-bootstrap-icons';
import './InvestmentInfo.css';

function InvestmentInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const { buildingData } = location.state || {};

  const listings = buildingData?.['건물정보']['매물목록'] || [];

  const handleInvestClick = (id) => {
    navigate(`/property/${id}/trade`);
  };

  return (
    <Container className="mb-1">
      <h4 className="card-title h5" style={{color:"#6C63FF !important"}}>최근 거래된 매물</h4>
      <Card className="investment-card mt-2">
        {/* <Card.Body> */}
          <div className="d-flex justify-content-between align-items-center mb-4" />

          {listings.length > 0 ? (
            <div className="table-responsive">
              <Table className="table-hover investment-table">
                <thead>
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
                      <td>{listing['층수']}층</td>
                      <td>{listing['유지비']}만원</td>
                      <td>{listing['집 평수']}평</td>
                      <td>
                        <Button
                          // variant="outline-primary"
                          size="sm"
                          className="rounded-pill px-3 custom-button"
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
            <p className="text-muted text-center py-5">매물 정보가 없습니다.</p>
          )}
        {/* </Card.Body> */}
      </Card>
    </Container>
  );
}

export default InvestmentInfo;

