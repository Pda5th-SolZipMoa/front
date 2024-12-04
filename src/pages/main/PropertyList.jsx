import React, { useState, useEffect } from 'react';
import { Form, Card, Container, Row, Col, Badge } from 'react-bootstrap';
import PropertyCard from './PropertyCard';
import styled from 'styled-components';

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
  console.log(filter);
  const [sortOrder, setSortOrder] = useState('수익률순');

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
      return a.price - b.price;
    } else if (sortOrder === '최신순') {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    return 0;
  });

  return (
    <StyledCard>
      <Card.Body className="p-3">
        <Container fluid className="px-0">
          <Row className="mb-3 align-items-center">
            <Col>
              <GradientText>주변 SOL집 찾기</GradientText>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <button
                style={{
                  display: 'inline-block',
                  backgroundColor: '#6c63ff', // 보라색 배경
                  color: '#fff', // 흰색 텍스트
                  padding: '10px 10px', // 버튼 내부 여백
                  border: 'none', // 테두리 제거
                  borderRadius: '12px', // 둥근 모서리
                  fontSize: '14px', // 텍스트 크기
                  fontWeight: 'bold', // 텍스트 굵기
                  cursor: 'pointer', // 마우스 포인터 변경
                  textAlign: 'center', // 텍스트 중앙 정렬
                  transition: 'background-color 0.3s', // 배경색 전환 효과
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
          <ScrollableCardList>
            {sortedData?.length > 0 ? (
              sortedData.map((property, index) => (
                <PropertyCardWrapper key={index}>
                  <PropertyCard
                    id={property.id}
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
        </Container>
      </Card.Body>
    </StyledCard>
  );
};

export default PropertyList;
