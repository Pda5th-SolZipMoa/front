import React, { useState, useEffect } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/header/Header';
import Map from '../../components/map/Map';
import PropertyList from './PropertyList';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Main = () => {
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태
  const [selectedLocation, setSelectedLocation] = useState(null); // 선택된 위치 상태
  const [buildings, setBuildings] = useState([]); // 빌딩 데이터 상태
  const navigate = useNavigate();
  const [buildingData, setBuildingData] = useState(null);

  useEffect(() => {
    fetchBuildingLists();
  }, []);

  const fetchBuildingLists = async () => {
    try {
      const response = await axios.get('/api/buildings');
      setBuildings(response.data);
    } catch (error) {
      console.error('Error fetching building data:', error);
    }
  };

  const moveToLocation = (latitude, longitude) => {
    setSelectedLocation({ latitude, longitude });
  };

  const handleRouteButton = async (id) => {
    try {
      // API 요청하여 빌딩 데이터 가져오기
      const response = await axios.get(
        `/api/building-latest-transactions/${id}`
      );

      // 응답 데이터가 정상적으로 반환되었는지 확인
      if (
        response.status === 200 &&
        response.data &&
        response.data['건물정보'] &&
        response.data['건물정보']['매물목록']
      ) {
        const buildingData = response.data; // 응답에서 건물정보 추출

        console.log(buildingData); // 건물 정보 출력

        // 데이터와 함께 새로운 경로로 이동
        navigate('/property_sidedetail', {
          state: {
            buildingData, // 상태로 건물 데이터 전달
          },
        });
      } else {
        console.error('Building data not found in the response');
      }
    } catch (error) {
      console.error('Error fetching building data:', error);
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        onSelectLocation={setSelectedLocation} // 선택된 위치 전달
      />
      <Container className="mt-4">
        <Row>
          <Col md={8}>
            <Map
              keyword={searchQuery}
              onSearchResults={setSearchResults}
              selectedLocation={selectedLocation} // 선택된 위치 전달
              data={buildings} // 빌딩 데이터 전달
            />
          </Col>
          <Col md={4}>
            <PropertyList
              moveToLocation={moveToLocation} // moveToLocation 전달
              data={buildings}
              handleRoute={handleRouteButton}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Main;
