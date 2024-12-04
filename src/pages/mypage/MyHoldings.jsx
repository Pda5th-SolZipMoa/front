import React from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { useOwnershipContext } from './OwnershipContext';

export default function MyHoldings() {
  const { ownerships } = useOwnershipContext();

  return (
    <Card className="shadow-sm bg-light border-light">
      <Card.Body>
        <Card.Title className="text-primary">보유 종목</Card.Title>
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
                  // 각 카드가 한 줄에 3개씩 배치되도록 설정
                  <Col key={index} lg={4} md={6} sm={12} className="mb-4">
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          {/* 건물 이름과 층수 표시 */}
                          <h3 className="m-0 fw-semibold">
                            {token.building_name} - {token.detail_floor}층
                          </h3>
                          <span
                            className={`fs-5 fw-semibold ${
                              isProfitable ? 'text-success' : 'text-danger'
                            }`}
                          >
                            {profitRate}%
                          </span>
                        </div>

                        <Row className="g-4">
                          <Col xs={6}>
                            <div className="text-muted mb-2">보유수량</div>
                            <div className="fs-5">
                              {token.quantity.toLocaleString()}
                            </div>
                          </Col>

                          <Col xs={6}>
                            <div className="text-muted mb-2">현재 금액</div>
                            <div className="fs-5">
                              {latestPrice.toLocaleString()} KRW
                            </div>
                          </Col>

                          <Col xs={6}>
                            <div className="text-muted mb-2">평가금액</div>
                            <div className="fs-5">
                              {evalValue.toLocaleString()} KRW
                            </div>
                          </Col>

                          <Col xs={6}>
                            <div className="text-muted mb-2">매수평균가</div>
                            <div className="fs-5">
                              {token.buy_price?.toLocaleString() || '-'} KRW
                            </div>
                          </Col>
                        </Row>

                        <div className="mt-4 pt-3 border-top">
                          <div className="text-muted mb-2">평가손익</div>
                          <div
                            className={`fs-4 fw-bold ${
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
