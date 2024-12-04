import React, { useState, useEffect } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/header/Header';
import Map from '../../components/map/Map';
import PropertyList from './PropertyList';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const MainContainer = styled.div`
  min-height: 100vh;
`;

const ContentContainer = styled(Container)`
  padding-top: 2rem;
  max-width: 1400px;
`;

const MapColumn = styled(Col)`
  height: calc(100vh - 120px);
  @media (max-width: 768px) {
    height: 50vh;
  }
`;

const ListColumn = styled(Col)`
  height: calc(100vh - 120px);
  overflow-y: auto;
  @media (max-width: 768px) {
    height: 50vh;
  }
`;

export const Main = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const navigate = useNavigate();
  const [filter, setFilter] = useState('전체');
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
      const response = await axios.get(
        `/api/building-latest-transactions/${id}`
      );

      if (
        response.status === 200 &&
        response.data &&
        response.data['건물정보'] &&
        response.data['건물정보']['매물목록']
      ) {
        const buildingData = response.data;
        navigate('/property_sidedetail', {
          state: {
            buildingData,
            id,
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
    <MainContainer>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        onSelectLocation={setSelectedLocation}
      />
      <ContentContainer>
        <Row>
          <MapColumn lg={8} md={7} sm={12}>
            <Map
              keyword={searchQuery}
              onSearchResults={setSearchResults}
              selectedLocation={selectedLocation}
              data={buildings}
              filter={filter}
              setFilter={setFilter}
            />
          </MapColumn>
          <ListColumn lg={4} md={5} sm={12}>
            <PropertyList
              moveToLocation={moveToLocation}
              data={buildings}
              handleRoute={handleRouteButton}
              filter={filter}
              setFilter={setFilter}
            />
          </ListColumn>
        </Row>
      </ContentContainer>
    </MainContainer>
  );
};

export default Main;
