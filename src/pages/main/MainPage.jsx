import React, { useState, useEffect } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/header/Header';
import Map from '../../components/map/Map';
import PropertyList from './PropertyList';
import axios from 'axios';

export const Main = () => {
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태
  const [selectedLocation, setSelectedLocation] = useState(null); // 선택된 위치 상태
  const [buildings, setBuildings] = useState([]); // 빌딩 개수

  useEffect(() => {
    const fetchBuildingLists = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/buildings');
        setBuildings(response.data);
      } catch (error) {
        console.error('Error fetching building data:', error);
      }
    };

    fetchBuildingLists();
  }, []);

  return (
    <div style={{ backgroundColor: '#FAF8FF', minHeight: '100vh' }}>
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
              data={buildings}
            />
          </Col>
          <Col md={4}>
            <PropertyList
              data={buildings}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Main;
