import React from 'react';
import { Table } from 'react-bootstrap';

export default function TradeOptionsBox({ type, trades }) {
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
          {trades && trades.length > 0 ? (
            trades.map((trade, index) => (
              <tr
                key={index}
                className={type === 'buy' ? 'text-danger' : 'text-primary'}
              >
                <td>{trade.price}</td>
                <td>{trade.quantity}</td>
                <td>{(trade.price * trade.quantity).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
