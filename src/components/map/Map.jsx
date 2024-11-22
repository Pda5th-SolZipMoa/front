import React from 'react';
import { Card } from 'react-bootstrap';

const Map = () => (
  <Card className="mb-4">
    <Card.Body
      className="d-flex align-items-center justify-content-center"
      style={{ height: 'calc(100vh - 100px)' }}
    >
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5>지도를 불러오는 중입니다</h5>
        <p className="text-muted">잠시만 기다려주세요...</p>
      </div>
    </Card.Body>
  </Card>
);

export default Map;
