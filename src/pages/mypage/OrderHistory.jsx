import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Table, Nav, Badge } from 'react-bootstrap';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('fulfilled'); // 기본값은 "체결"

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/order_archives', {
          params: { status: filter }, // "체결" 또는 "취소"로 필터링
          withCredentials: true,
        });
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [filter]);

  // 주문 유형 뱃지
  const getOrderTypeBadge = (orderType) => {
    switch (orderType) {
      case 'buy':
        return <Badge bg="danger">매수</Badge>; // 빨간색
      case 'sell':
        return <Badge bg="primary">매도</Badge>; // 파란색
      default:
        return <Badge bg="secondary">알 수 없음</Badge>;
    }
  };

  // 주문 상태 뱃지
  const getStatusBadge = (status) => {
    switch (status) {
      case 'fulfilled':
        return <Badge bg="success">체결</Badge>; // 초록색
      case 'cancelled':
        return <Badge bg="secondary">취소</Badge>; // 회색
      default:
        return <Badge bg="secondary">알 수 없음</Badge>;
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        {/* 필터링 네비게이션 */}
        <Nav
          variant="tabs"
          className="mb-3"
          activeKey={filter}
          onSelect={(selectedKey) => setFilter(selectedKey)}
        >
          <Nav.Item>
            <Nav.Link eventKey="fulfilled">체결</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="cancelled">취소</Nav.Link>
          </Nav.Item>
        </Nav>

        {/* 주문 기록 테이블 */}
        <Table responsive>
          <thead>
            <tr>
              <th>건물 - 층수</th>
              <th>주문 유형</th>
              <th>가격</th>
              <th>수량</th>
              <th>상태</th>
              <th>날짜</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={index}>
                  {/* 건물 이름 - 층수 */}
                  <td>
                    {order.building_name} - {order.detail_floor}층
                  </td>
                  {/* 주문 유형 뱃지 */}
                  <td>{getOrderTypeBadge(order.order_type)}</td>
                  {/* 가격 */}
                  <td>{order.price_per_token.toLocaleString()} KRW</td>
                  {/* 수량 */}
                  <td>{order.quantity}</td>
                  {/* 상태 뱃지 */}
                  <td>{getStatusBadge(order.status)}</td>
                  {/* 날짜 */}
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  주문 기록이 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
