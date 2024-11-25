import React from 'react';
import { Card } from 'react-bootstrap';

const cardStyles = {
  container: {
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    backgroundColor: '#ffffff',
    padding: '10px',
    minHeight: '350px',
    maxHeight: '500px',
    overflowY: 'auto',
  },
  img: {
    height: '200px',
    objectFit: 'cover',
  },
};

const PropertyCard = ({
  name,
  image,
  price,
  tokenPrice,
  availableTokens,
  percentage,
  moveToLocation,
  lat,
  lng,
}) => {
  const percentageColor = percentage > 0 ? 'text-success' : 'text-danger';

  return (
    <Card
      onClick={() => {
        moveToLocation(lat, lng);
      }}
      className="mb-3"
      style={cardStyles.container}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
      }}
    >
      <Card.Img variant="top" src={image} style={cardStyles.img} />
      <Card.Body>
        <div className="d-flex justify-content-between mb-2">
          <Card.Title style={{ fontWeight: 'bold' }}>{name}</Card.Title>
          <span className={percentageColor}>
            {percentage > 0 ? `+${percentage}` : percentage}%
          </span>
        </div>
        <Card.Text as="div">
          <small className="text-muted">
            <div className="d-flex justify-content-between">
              <span>공모 금액</span>
              <span>{price}원</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>토큰당 금액</span>
              <span>{tokenPrice}원</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>거래 가능 토큰</span>
              <span>{availableTokens}개</span>
            </div>
          </small>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default PropertyCard;
