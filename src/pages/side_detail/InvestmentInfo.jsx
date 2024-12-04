import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Table, Button, Card } from 'react-bootstrap';
import './InvestmentInfo.css';

function InvestmentInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buildingId, setBuildingId] = useState('');
  const { id } = location.state || {}; // property ID 가져오기

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/property/details/${id}`);
        setProperty(response.data);
        setBuildingId(response.data.property_id);
      } catch (err) {
        console.error('오류 발생:', err);
        setError(err.message || '데이터를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  const handleInvestClick = (roomId, status) => {
    if (status === 'pending') {
      navigate(`/property_detail/info/${buildingId}/${roomId}`);
    } else {
      navigate(`/property/${roomId}/trade`);
    }
  };

  if (loading) {
    return <p className="text-center py-5">로딩 중...</p>;
  }

  if (error) {
    return <p className="text-center py-5 text-danger">오류 발생: {error}</p>;
  }

  return (
    <Container className="mb-1">
      <h4 className="card-title h5" style={{ color: '#6C63FF' }}>
        거래 가능한 매물목록
      </h4>
      <Card className="investment-card mt-2">
        {property?.rooms?.length > 0 ? (
          <div className="table-responsive">
            <Table className="table-hover investment-table text-center">
              <thead>
                <tr>
                  <th>층수</th>
                  <th>유지비</th>
                  <th>집 평수</th>
                  <th>투자하기</th>
                </tr>
              </thead>
              <tbody>
                {property.rooms.map((room) => (
                  <tr key={room.room_id}>
                    <td>{room.detail_floor}층</td>
                    <td>{room.maintenance_cost}만원</td>
                    <td>{room.home_size}평</td>
                    <td>
                      <Button
                        size="sm"
                        className="rounded-pill px-3 custom-button"
                        onClick={() =>
                          handleInvestClick(room.room_id, 'pending')
                        }
                      >
                        청약하기
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <p className="text-muted text-center py-5">매물 정보가 없습니다.</p>
        )}
      </Card>
    </Container>
  );
}

export default InvestmentInfo;
