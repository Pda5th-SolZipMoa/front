import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { useOwnershipContext } from './OwnershipContext';

export default function MyAsset() {
  const { balance } = useOwnershipContext();

  return (
    <Card className="shadow-sm bg-light border-light">
      <Card.Body>
        <Card.Title className="text-primary">내 보유자산</Card.Title>
        <ListGroup variant="flush">
          <ListGroup.Item className="d-flex justify-content-between">
            <span>보유 KRW</span>
            <span className="text-primary">
              {balance?.total_balance?.toLocaleString() || 0} KRW
            </span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between">
            <span>총 매수</span>
            <span className="text-primary">
              {balance?.total_buy?.toLocaleString() || 0} KRW
            </span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between">
            <span>총 평가</span>
            <span className="text-primary">
              {balance?.total_eval?.toLocaleString() || 0} KRW
            </span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between">
            <span>총 평가손익</span>
            <span className="text-primary">
              {balance?.profit_loss?.toLocaleString() || 0} KRW
            </span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between">
            <span>수익률</span>
            <span className="text-primary">{balance?.profit_rate || 0}%</span>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}
