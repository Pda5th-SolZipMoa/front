import React from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { useOwnershipContext } from './OwnershipContext';
import { useNavigate } from 'react-router-dom';

export default function MyHoldings() {
  const { ownerships } = useOwnershipContext();
  const navigate = useNavigate();

  return (
    <Card className="shadow-sm bg-light border-light">
      <Card.Body>
        <Card.Title className="text-primary fs-4">보유 종목</Card.Title>
        <Container fluid>
          {ownerships.length > 0 ? (
            <Row>
              {ownerships.map((token, index) => {
                const latestPrice = token.latest_price || 0;
                const evalValue = token.quantity * latestPrice;
                const buyValue = token.quantity * (token.buy_price || 0);
                const profitLoss = evalValue - buyValue;
                const profitRate =
                  buyValue > 0 ? ((profitLoss / buyValue) * 100).toFixed(2) : 0;
                const isProfitable = profitLoss > 0;

                return (
                  <Col key={index} lg={4} md={6} sm={12} className="mb-4">
                    <Card
                      className="h-100 border-0 shadow-sm"
                      onClick={() => navigate(`/property/${token.id}/trade`)} // 클릭 시 이동
                      style={{ cursor: 'pointer' }} // 클릭 가능한 카드로 보이게 스타일 적용
                    >
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h4 className="m-0 fw-semibold fs-5">
                            {token.building_name} - {token.detail_floor}층
                          </h4>
                          <span
                            className={`fs-6 fw-semibold ${
                              isProfitable ? 'text-success' : 'text-danger'
                            }`}
                          >
                            {profitRate}%
                          </span>
                        </div>

                        <Row className="g-3">
                          <Col xs={6}>
                            <div className="text-muted mb-1">보유수량</div>
                            <div className="fs-6">
                              {token.quantity.toLocaleString()}
                            </div>
                          </Col>

                          <Col xs={6}>
                            <div className="text-muted mb-1">현재 금액</div>
                            <div className="fs-6">
                              {latestPrice.toLocaleString()} KRW
                            </div>
                          </Col>

                          <Col xs={6}>
                            <div className="text-muted mb-1">평가금액</div>
                            <div className="fs-6">
                              {evalValue.toLocaleString()} KRW
                            </div>
                          </Col>

                          <Col xs={6}>
                            <div className="text-muted mb-1">매수평균가</div>
                            <div className="fs-6">
                              {token.buy_price?.toLocaleString() || '-'} KRW
                            </div>
                          </Col>
                        </Row>

                        <div className="mt-3 pt-2 border-top">
                          <div className="text-muted mb-1">평가손익</div>
                          <div
                            className={`fs-5 fw-bold ${
                              isProfitable ? 'text-success' : 'text-danger'
                            }`}
                          >
                            {profitLoss !== 0
                              ? `${profitLoss.toLocaleString()} KRW`
                              : '-'}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <Card className="text-center p-5 border-0">
              <Card.Body>
                <h5 className="text-muted">보유 자산이 없습니다</h5>
              </Card.Body>
            </Card>
          )}
        </Container>
      </Card.Body>
    </Card>
  );
}
