import React, { useState } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/header/Header';
import Map from '../../components/map/Map';
import PropertyList from './PropertyList';

export const Main = () => {
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태
  const [selectedLocation, setSelectedLocation] = useState(null); // 선택된 위치 상태

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
            />
          </Col>
          <Col md={4}>
            <PropertyList searchResults={searchResults} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Main;
