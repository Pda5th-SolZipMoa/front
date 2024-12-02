import React, { useState, useEffect, useRef } from 'react';
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
  const websocketRef = useRef(null); // WebSocket 참조

  // 호가 데이터를 정렬 함수
  const sortOrderBook = (orderBook) => {
    const buyOrders = Object.entries(orderBook.buy || {})
      .flatMap(([price, orders]) =>
        orders.map((order) => ({
          price: parseFloat(price),
          quantity: order.quantity,
        }))
      )
      .sort((a, b) => b.price - a.price); // 매수는 높은 가격 순으로 정렬

    const sellOrders = Object.entries(orderBook.sell || {})
      .flatMap(([price, orders]) =>
        orders.map((order) => ({
          price: parseFloat(price),
          quantity: order.quantity,
        }))
      )
      .sort((a, b) => a.price - b.price); // 매도는 낮은 가격 순으로 정렬

    return { buy: buyOrders, sell: sellOrders };
  };

  // 초기 REST API를 통해 호가 데이터를 가져오기
  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        const response = await axios.get(`/api/orders/${propertyId}`);
        const sortedOrders = sortOrderBook(response.data.order_book);
        setBuyOrders(sortedOrders.buy);
        setSellOrders(sortedOrders.sell);
        console.log(`호가 데이터 가져오기 성공: ${propertyId}`);
      } catch (err) {
        console.error('호가 데이터 가져오기 실패:', err);
      }
    };

    fetchOrderBook();
  }, [propertyId]);

  // WebSocket 연결 관리
  useEffect(() => {
    if (websocketRef.current) {
      websocketRef.current.close();
    }

    const ws = new WebSocket(`/api/ws/orders/${propertyId}`);
    websocketRef.current = ws;

    ws.onopen = () => {
      console.log(`WebSocket 연결 성공: propertyId=${propertyId}`);
    };

    ws.onmessage = (event) => {
      console.log('WebSocket 메시지 수신:', event.data);
      try {
        const data = JSON.parse(event.data);
        const sortedOrders = sortOrderBook(data.order_book);
        console.log('업데이트된 매수 데이터:', sortedOrders.buy);
        console.log('업데이트된 매도 데이터:', sortedOrders.sell);
        setBuyOrders(sortedOrders.buy);
        setSellOrders(sortedOrders.sell);
      } catch (err) {
        console.error('WebSocket 메시지 처리 실패:', err);
      }
    };

    ws.onclose = () => {
      console.warn('WebSocket 연결이 종료되었습니다.');
    };

    ws.onerror = (error) => {
      console.error('WebSocket 오류:', error);
    };

    return () => {
      ws.close();
    };
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
