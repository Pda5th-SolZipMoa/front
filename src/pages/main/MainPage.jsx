import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/header/Header';
import Map from '../../components/map/Map';
import PropertyList from './PropertyList';

export const Main = () => {
  return (
    <div style={{ backgroundColor: '#FAF8FF', minHeight: '100vh' }}>
      <Header />
      <Container className="mt-4">
        <Row>
          <Col md={8}>
            <Map />
          </Col>
          <Col md={4}>
            <PropertyList />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Main;
