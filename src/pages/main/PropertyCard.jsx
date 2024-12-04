import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const cardStyles = {
  container: {
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '350px',
    maxHeight: '400px',
    cursor: 'pointer',
    marginBottom: '30px',
  },
  img: {
    height: '160px',
    objectFit: 'cover',
    borderBottom: '1px solid #ddd',
  },
  cardBody: {
    padding: '16px',
    flex: '1',
  },
  title: {
    fontWeight: '600',
    fontSize: '1.2rem',
    marginBottom: '8px',
  },
  percentage: {
    fontWeight: '500',
    fontSize: '0.9rem',
  },
  textGroup: {
    fontSize: '0.85rem',
    color: '#666',
    marginTop: '8px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  buttonContainer: {
    marginTop: '12px',
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    background:
      'linear-gradient(117deg, #A8B3F2 10%, #B690EE 30%, #D28BBD 55%, #F68EA3 80%)',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'background 0.2s ease, transform 0.2s ease',
    color: '#fff',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
};

const PropertyCard = ({
  id,
  name,
  image,
  price,
  address,
  tokenSupply,
  tokenPrice,
  percentage,
  moveToLocation,
  lat,
  lng,
  status,
  handleRoute,
}) => {
  const navigate = useNavigate();
  const percentageColor = percentage > 0 ? 'text-success' : 'text-danger';
  const fullImageUrls = `http://3.37.185.91:8000/${image}`;
  console.log(fullImageUrls);

  return (
    <Card
      onClick={() => {
        moveToLocation(lat, lng);
      }}
      style={cardStyles.container}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.1)';
      }}
    >
      <Card.Img variant="top" src={fullImageUrls} style={cardStyles.img} />
      <Card.Body style={cardStyles.cardBody}>
        <div style={cardStyles.row}>
          <Card.Title style={cardStyles.title}>{name}</Card.Title>
        </div>
        <Card.Text style={cardStyles.textGroup}>
          <div style={cardStyles.row}>
            <span>실거래가</span>
            <span>{price} 만원</span>
          </div>
          <div style={cardStyles.row}>
            <span>주소</span>
            <span>{address}</span>
          </div>
          {/*
          <div style={cardStyles.row}>
            <span>토큰 당 가격</span>
            <span>{tokenPrice} 만원</span>
          </div>
    */}
        </Card.Text>
        <div style={cardStyles.buttonContainer}>
          <Button
            style={cardStyles.button}
            onClick={(e) => {
              e.stopPropagation();
              handleRoute(id);
            }}
          >
            상세 페이지로 이동 {`>`}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PropertyCard;
