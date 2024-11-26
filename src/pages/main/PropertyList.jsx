import React from 'react';
import { Form } from 'react-bootstrap';
import PropertyCard from './PropertyCard';

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 12px;
    background-color: #f0f0f0;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background-color: #f0f0f0;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #A8B3F2 0%, #B690EE 21%, #F68EA3 57.5%, #FBAD7A 99.5%);
    border-radius: 10px;
    border: 2px solid #f0f0f0;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #A8B3F2 0%, #B690EE 21%, #F68EA3 57.5%, #FBAD7A 99.5%);
  }
`;

const listStyles = {
  container: {
    height: 'calc(100vh - 100px)',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    marginBottom: '1rem',
  },
  cardList: {
    overflowY: 'auto',
    flex: 1,
    padding: '10px',
    marginRight: '-12px',
  },
  select: {
    width: '140px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderRadius: '5px',
    borderImage:
      'linear-gradient(117deg, #A8B3F2 10%, #B690EE 30%, #D28BBD 55%, #F68EA3 80%)',
    borderImageSlice: 1,
  },
};

const PropertyList = ({ moveToLocation, data, handleRoute }) => {
  return (
    <div style={listStyles.container}>
      <div
        style={listStyles.header}
        className="d-flex justify-content-between align-items-center"
      >
        <h5
          style={{
            background:
              'linear-gradient(117deg, #A8B3F2 10%, #B690EE 30%, #D28BBD 55%, #F68EA3 80%)',
            WebkitBackgroundClip: 'text', // 텍스트 부분만 그라디언트 표시
            WebkitTextFillColor: 'transparent', // 텍스트 채우기 투명
            fontWeight: 'bold', // 추가적으로 텍스트 스타일 조정
          }}
        >
          주변 SOL집 찾기
        </h5>
        <Form.Select style={listStyles.select}>
          <option>수익률순</option>
          <option>가격순</option>
          <option>최신순</option>
        </Form.Select>
      </div>
      <div style={listStyles.cardList} className="custom-scrollbar">
        {data?.map((property, index) => (
          <PropertyCard
            key={index}
            id={property.id}
            name={property.name}
            image={property.photos[0]?.url}
            price={property.price}
            tokenPrice={property.token_supply}
            availableTokens={property.availableTokens}
            percentage={property.percentage}
            lat={property.lat}
            lng={property.lng}
            moveToLocation={moveToLocation}
            handleRoute={handleRoute}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
