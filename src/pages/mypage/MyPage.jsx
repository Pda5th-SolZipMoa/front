import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import Portfolio from './Portfolio';
import MyHoldings from './MyHoldings';
import OrderHistory from './OrderHistory';
import PendingOrders from './PendingOrders';
import MyAsset from './MyAsset';
import Header from '../../components/header/Header';
import { OwnershipProvider } from './OwnershipContext';
import './MyPage.css';
import SubscriptionRecords from './SubscriptionHistory';

export default function MyPage() {
  const [activeTab, setActiveTab] = useState('보유자산');

  return (
    <OwnershipProvider>
      <div className="my-page bg-light min-vh-100">
        <Header />
        <Container className="py-4">
          <Nav
            variant="tabs"
            className="mb-4 nav-tabs-custom"
            activeKey={activeTab}
            onSelect={(selectedKey) => setActiveTab(selectedKey)}
          >
            <Nav.Item>
              <Nav.Link eventKey="보유자산" className="custom-tab">
                보유자산
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="거래내역" className="custom-tab">
                거래내역
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="미체결" className="custom-tab">
                미체결
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="청약" className="custom-tab">
                청약
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Card className="shadow-sm card-custom">
            <Card.Body>
              {activeTab === '보유자산' && (
                <>
                  <Row>
                    <Col md={6}>
                      <Portfolio />
                    </Col>
                    <Col md={6}>
                      <MyAsset />
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col>
                      <MyHoldings />
                    </Col>
                  </Row>
                </>
              )}
              {activeTab === '거래내역' && <OrderHistory />}
              {activeTab === '미체결' && <PendingOrders />}
              {activeTab === '청약' && <SubscriptionRecords />}
            </Card.Body>
          </Card>
        </Container>
      </div>
    </OwnershipProvider>
  );
}
