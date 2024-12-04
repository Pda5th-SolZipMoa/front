import React, { useState, useEffect } from 'react';
import { Form, Card, Container, Row, Col, Badge } from 'react-bootstrap';
import PropertyCard from './PropertyCard';
import styled from 'styled-components';
import { CircleLoader } from 'react-spinners';

const GradientText = styled.h5`
  color: #6c63ff;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(108, 99, 255, 0.2);
  margin-bottom: 0;
  font-size: 1.6rem;
`;
const StyledSelect = styled(Form.Select)`
  width: 120px;
  border: 2px solid #6c63ff;
  border-radius: 5px;
  color: #6c63ff;
  background-color: rgba(108, 99, 255, 0.1);
  transition: all 0.3s ease;
  font-size: 0.9rem;
  margin-left: 100px; /* 오른쪽으로 이동 */

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba(108, 99, 255, 0.25);
  }
`;

const ScrollableCardList = styled.div`
  height: calc(100vh - 200px);
  overflow-y: auto;
  padding: 10px;
  margin-right: -12px;
  background-color: transparent;

  &::-webkit-scrollbar {
    width: 8px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #6c63ff;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #5a52e0;
  }
`;

const StyledCard = styled(Card)`
  border: none;
  background-color: transparent;
  box-shadow: none;
  transition: all 0.3s ease;
`;

const StyledBadge = styled(Badge)`
  display: inline-block;
  background-color: #6c63ff;
  color: #fff;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
`;

const PropertyCardWrapper = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(108, 99, 255, 0.1);
  margin-bottom: 10px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 2px 5px rgba(108, 99, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const PropertyList = ({ moveToLocation, data, handleRoute, filter }) => {
  const [sortOrder, setSortOrder] = useState('수익률순');
  const [loading, setLoading] = useState(true); // 로딩 상태 관리

  useEffect(() => {
    // 데이터 로딩을 시뮬레이션하는 경우
    setTimeout(() => {
      setLoading(false); // 데이터 로딩 완료
    }, 2000); // 2초 후 로딩 완료 처리
  }, []);

  // 필터링된 데이터 계산
  const filteredData = data.filter((property) => {
    if (filter === '전체') return true;
    if (filter === '청약') return property.status?.toLowerCase() === 'pending';
    if (filter === '투자')
      return property.status?.toLowerCase() === 'fulfilled';
    return true;
  });

  // 정렬된 데이터 계산
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOrder === '수익률순') {
      return b.percentage - a.percentage;
    } else if (sortOrder === '가격순') {
      return b.price - a.price;
    } else if (sortOrder === '최신순') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortOrder === '전체') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  return (
    <StyledCard>
      <Card.Body className="p-3">
        <Container fluid className="px-0">
          <Row className="mb-3 align-items-center">
            <Col>
              <GradientText style={{ fontSize: '23px' }}>
                주변 SOL집 찾기
              </GradientText>
            </Col>
            <Col className="text-end">
              {/* Sorting Dropdown */}
              <StyledSelect value={sortOrder} onChange={handleSortChange}>
                <option value="전체">전체</option>
                <option value="가격순">가격순</option>
                <option value="최신순">최신순</option>
              </StyledSelect>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <button
                style={{
                  display: 'inline-block',
                  backgroundColor: '#6c63ff',
                  color: '#fff',
                  padding: '10px 10px',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = '#5b54e3')
                } // 호버 효과
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = '#6c63ff')
                } // 호버 효과 해제
              >
                {`${sortedData.length}개의 매물`}
              </button>
            </Col>
          </Row>

          {/* 로딩 중일 때 동그랗게 돌아가는 로딩 표시 */}
          {loading ? (
            <div
              className="d-flex justify-content-center"
              style={{ marginTop: '250px' }}
            >
              <CircleLoader size={60} color="#6c63ff" />
            </div>
          ) : (
            <ScrollableCardList>
              {sortedData?.length > 0 ? (
                sortedData.map((property, index) => (
                  <PropertyCardWrapper key={index}>
                    <PropertyCard
                      id={property.id}
                      address={property.address}
                      name={property.name}
                      image={property.photos[0]?.url}
                      price={property.price}
                      tokenSupply={property.token_supply}
                      tokenPrice={property.token_cost}
                      percentage={property.percentage}
                      lat={property.lat}
                      lng={property.lng}
                      status={property.status}
                      moveToLocation={moveToLocation}
                      handleRoute={handleRoute}
                    />
                  </PropertyCardWrapper>
                ))
              ) : (
                <p className="text-center text-muted">
                  해당 조건에 맞는 데이터가 없습니다.
                </p>
              )}
            </ScrollableCardList>
          )}
        </Container>
      </Card.Body>
    </StyledCard>
  );
};

export default PropertyList;
