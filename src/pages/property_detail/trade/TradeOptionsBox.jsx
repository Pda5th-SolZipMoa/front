import React from 'react';
import { Table } from 'react-bootstrap';

export default function TradeOptionsBox({ type }) {
  const trades = [
    { price: '53,500', quantity: 100, total: '5,350,000' },
    { price: '53,000', quantity: 150, total: '7,950,000' },
    { price: '52,500', quantity: 200, total: '10,500,000' },
    { price: '52,000', quantity: 250, total: '13,000,000' },
    { price: '51,500', quantity: 300, total: '15,450,000' },
  ];

  return (
    <div className="mb-3">
      <Table striped bordered hover size="sm">
        <thead>
          <tr className="bg-light">
            <th>가격</th>
            <th>수량</th>
            <th>총액</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade, index) => (
            <tr
              key={index}
              className={type === 'buy' ? 'text-danger' : 'text-primary'}
            >
              <td>{trade.price}</td>
              <td>{trade.quantity}</td>
              <td>{trade.total}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
