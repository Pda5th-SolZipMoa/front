import React from 'react';
import { Form, Button } from 'react-bootstrap';

export default function TradeOrderForm({ type }) {
  const buttonColor = type === 'buy' ? 'danger' : 'primary';
  const buttonText = type === 'buy' ? '매수하기' : '매도하기';

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>주문가격</Form.Label>
        <Form.Control type="number" placeholder="53500" />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>주문수량</Form.Label>
        <Form.Control type="number" placeholder="0" />
      </Form.Group>
      <div className="d-flex justify-content-between mb-3">
        <span>{type === 'buy' ? '원화잔액' : '토큰잔액'}</span>
        <span>0 {type === 'buy' ? '원' : '개'}</span>
      </div>
      <div className="d-flex justify-content-between mb-3">
        <span>이용가능</span>
        <span>0 {type === 'buy' ? '원' : '개'}</span>
      </div>
      <Button variant={buttonColor} className="w-100">
        {buttonText}
      </Button>
    </Form>
  );
}
