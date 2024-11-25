import React from 'react';
import { Table } from 'react-bootstrap';

export default function TradeOptionsBox({ type, trades }) {
  return (
    <div className="mb-3 p-3 border rounded shadow-sm bg-white">
      <Table bordered hover size="sm" className="text-center custom-table">
        <thead>
          <tr className="bg-pastel-purple text-white">
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
                className={type === 'buy' ? 'text-success' : 'text-danger'}
              >
                <td>{trade.price.toLocaleString()}</td>
                <td>{trade.quantity.toLocaleString()}</td>
                <td>{(trade.price * trade.quantity).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center text-muted">
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
