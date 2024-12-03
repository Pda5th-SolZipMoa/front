import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { TradeProvider } from './TradeContext';
import TradeGraph from './TradeGraph';
import TradeBoard from './TradeBoard';
import './trade_style.css';
import Header from '../../../components/header/Header';

export default function TradeMain() {
  const { id } = useParams(); // 건물id

  return (
    <TradeProvider id={id}>
      <div className="bg-light min-vh-100">
        <Header></Header>

        <div className="p-4">
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
      </div>
    </TradeProvider>
  );
}
