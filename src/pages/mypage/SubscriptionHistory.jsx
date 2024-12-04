import React, { useEffect, useState } from 'react';
import { Table, Card, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionRecords() {
  const [subscriptions, setSubscriptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get('/api/subscriptions/subscriptions');
        setSubscriptions(response.data.subscriptions);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      }
    };

    fetchSubscriptions();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="secondary">청약 진행 중</Badge>; // 회색
      case 'fulfilled':
        return <Badge bg="success">배정 완료</Badge>; // 초록색
      case 'cancelled':
        return <Badge bg="danger">취소</Badge>; // 빨간색
      default:
        return <Badge bg="secondary">알 수 없음</Badge>;
    }
  };

  // 행 클릭 핸들러
  const handleRowClick = (buildingId) => {
    navigate(`/property_detail/info/${buildingId}`);
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title className="text-primary">청약 내역</Card.Title>
        <Table responsive>
          <thead>
            <tr>
              <th>건물 - 층수</th>
              <th>가격 (원)</th>
              <th>수량</th>
              <th>상태</th>
              <th>청약 신청 날짜</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions?.length > 0 ? (
              subscriptions?.map((subscription, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(subscription.building_id)} // 행 클릭 시 이동
                  style={{ cursor: 'pointer' }} // 클릭 가능하도록 커서 스타일 추가
                >
                  <td>
                    {subscription.building_name} - {subscription.detail_floor}층
                  </td>
                  {/* 가격 */}
                  <td>
                    {Number(subscription.price_per_token).toLocaleString(
                      'ko-KR'
                    )}{' '}
                    원
                  </td>
                  {/* 수량 */}
                  <td>{subscription.quantity}</td>
                  {/* 상태 뱃지 */}
                  <td>{getStatusBadge(subscription.status)}</td>
                  {/* 청약 날짜 */}
                  <td>
                    {new Date(subscription.created_at).toLocaleDateString(
                      'ko-KR'
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  청약 기록이 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
