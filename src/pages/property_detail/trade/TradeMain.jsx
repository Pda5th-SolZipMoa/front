import React from 'react';
import { Container, Row, Col, Navbar } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { TradeProvider } from './TradeContext';
import TradeGraph from './TradeGraph';
import TradeBoard from './TradeBoard';
import './trade_style.css';

export default function TradeMain() {
  const { id } = useParams(); // 건물id

  return (
    <TradeProvider id={id}>
      <div className="bg-light min-vh-100">
        <Navbar bg="white" className="border-bottom mb-3">
          <Container>
            <Navbar.Brand href="#" className="d-flex align-items-center">
              <div className="text-purple me-2">SOL집모아</div>
            </Navbar.Brand>
          </Container>
        </Navbar>

        <Container>
          <Row>
            <Col md={8}>
              <TradeGraph />
            </Col>
            <Col md={4}>
              <TradeBoard />
            </Col>
          </Row>
        </Container>
      </div>
    </TradeProvider>
  );
}
