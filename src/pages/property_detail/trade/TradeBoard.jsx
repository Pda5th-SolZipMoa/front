import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import TradeOptionsBox from './TradeOptionsBox';
import TradeOrderForm from './TradeOrderForm';
import axios from 'axios';
import { useTradeContext } from './TradeContext';

export default function TradeBoard() {
  const { id: propertyId } = useTradeContext(); // 건물Id를 Context에서 가져옴
  const [key, setKey] = useState('buy'); // 현재 활성화된 탭
  const [buyOrders, setBuyOrders] = useState([]); // 매수 데이터
  const [sellOrders, setSellOrders] = useState([]); // 매도 데이터

  // 호가 데이터 가져오기 - propertyId 변경 시 다시 로드
  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        const response = await axios.get(`/api/orders/${propertyId}`);
        const { buy, sell } = response.data.order_book;
        // 데이터를 가격 내림차순 정렬
        setBuyOrders(
          Object.entries(buy).flatMap(([price, orders]) =>
            orders.map((order) => ({
              price: parseFloat(price),
              quantity: order.quantity,
            }))
          )
        );
        setSellOrders(
          Object.entries(sell).flatMap(([price, orders]) =>
            orders.map((order) => ({
              price: parseFloat(price),
              quantity: order.quantity,
            }))
          )
        );
      } catch (err) {
        console.error('호가 데이터 가져오기 실패:', err);
      }
    };

    fetchOrderBook();
  }, [propertyId]);

  return (
    <div className="border rounded p-3 bg-white">
      <Tabs
        id="trade-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="buy" title="매수">
          {/* 매수 데이터 전달 */}
          <TradeOptionsBox type="buy" trades={buyOrders} />
          <TradeOrderForm type="buy" />
        </Tab>
        <Tab eventKey="sell" title="매도">
          {/* 매도 데이터 전달 */}
          <TradeOptionsBox type="sell" trades={sellOrders} />
          <TradeOrderForm type="sell" />
        </Tab>
      </Tabs>
    </div>
  );
}
