import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { PropertyInput } from './FormInput';

export const PropertyDetails = ({ formData, setFormData }) => {
  return (
    <Card className="mb-4 border-0">
      <Card.Body>
        <Row>
          <Col md={6}>
            <PropertyInput
              label="층수"
              placeholder="층수를 입력하세요"
              value={formData.detail_floor}
              onChange={(e) =>
                setFormData({ ...formData, detail_floor: e.target.value })
              }
            />
          </Col>
          <Col md={6}>
            <PropertyInput
              label="룸 개수"
              placeholder="방 / 화장실 (형식에 맞춰 작성해 주세요)"
              value={formData.room_cnt}
              onChange={(e) =>
                setFormData({ ...formData, room_cnt: e.target.value })
              }
            />
          </Col>
          <Col md={6}>
            <PropertyInput
              label="집 평수"
              placeholder="평수를 입력하세요"
              value={formData.home_size}
              onChange={(e) =>
                setFormData({ ...formData, home_size: e.target.value })
              }
            />
          </Col>
          <Col md={6}>
            <PropertyInput
              label="유지비"
              placeholder="금액을 입력하세요"
              value={formData.maintenance_cost}
              onChange={(e) =>
                setFormData({ ...formData, maintenance_cost: e.target.value })
              }
              suffix="만원"
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

