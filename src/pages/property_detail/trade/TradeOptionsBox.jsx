import React from 'react';
import { Table } from 'react-bootstrap';

// 데이터 그룹화 함수
const groupTradesByPrice = (trades) => {
  const grouped = {};
  trades.forEach((trade) => {
    if (grouped[trade.price]) {
      grouped[trade.price].quantity += trade.quantity;
    } else {
      grouped[trade.price] = { price: trade.price, quantity: trade.quantity };
    }
  });
  return Object.values(grouped);
};

export default function TradeOptionsBox({ type, trades }) {
  // 가격별로 그룹화된 데이터 생성
  const groupedTrades = groupTradesByPrice(trades);

  // 타입에 따라 정렬 (매수: 내림차순, 매도: 오름차순)
  const sortedTrades = groupedTrades.sort((a, b) =>
    type === 'buy' ? b.price - a.price : a.price - b.price
  );

  return (
    <div className="mb-3 p-3 border rounded shadow-sm bg-white">
      {/* 스타일을 직접 여기에 지정 */}
      <div
        style={{
          maxHeight: '200px', // 최대 높이 설정
          overflowY: 'auto', // 세로 스크롤 활성화
        }}
      >
        <Table bordered hover size="sm" className="text-center custom-table">
          <thead>
            <tr className="bg-pastel-purple text-white">
              <th>가격</th>
              <th>수량</th>
              <th>총액</th>
            </tr>
          </thead>
          <tbody>
            {sortedTrades && sortedTrades.length > 0 ? (
              sortedTrades.map((trade, index) => (
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
    </div>
  );
}
