import React from 'react';
import { Container, Row, Col, Navbar, Form, Button } from 'react-bootstrap';
import TradeGraph from './TradeGraph';
import TradeBoard from './TradeBoard';
import './trade_style.css';

export default function TradeMain() {
  return (
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
  );
}
