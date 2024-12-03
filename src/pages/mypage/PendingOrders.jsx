import React, { useEffect, useState } from 'react';
import { Table, Card, Badge, Button } from 'react-bootstrap';
import axios from 'axios';
import { FiXCircle } from 'react-icons/fi';

export default function PendingOrders() {
  const [pendingOrders, setPendingOrders] = useState([]);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const response = await axios.get('/api/order_archives', {
          params: { status: 'normal' }, // status를 normal로 필터링
          withCredentials: true,
        });
        setPendingOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching pending orders:', error);
      }
    };

    fetchPendingOrders();
  }, []);

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

  // 상태 뱃지
  const getStatusBadge = (status) => {
    switch (status) {
      case 'normal':
        return <Badge bg="secondary">미체결</Badge>; // 회색
      default:
        return <Badge bg="secondary">알 수 없음</Badge>;
    }
  };

  // 주문 취소 요청 함수
  const cancelOrder = async (orderId) => {
    try {
      await axios.delete(`/api/orders/${orderId}`, { withCredentials: true });
      // 주문 취소 성공 시 목록에서 제거
      setPendingOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
      alert('주문이 성공적으로 취소되었습니다.');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('주문 취소에 실패했습니다.');
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title className="text-primary">미체결 주문</Card.Title>
        <Table responsive>
          <thead>
            <tr>
              <th>건물 - 층수</th>
              <th>주문 유형</th>
              <th>가격</th>
              <th>수량</th>
              <th>상태</th>
              <th>주문 날짜</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pendingOrders.length > 0 ? (
              pendingOrders.map((order, index) => (
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
                  {/* 주문 날짜 */}
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  {/* 취소 버튼 */}
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => cancelOrder(order.id)}
                      className="d-flex align-items-center"
                    >
                      <FiXCircle style={{ marginRight: '4px' }} />
                      취소
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  미체결된 주문이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
