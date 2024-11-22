import React from 'react';
import { Form } from 'react-bootstrap';
import PropertyCard from './PropertyCard';

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
};

const PropertyList = () => {
  return (
    <>
      <style>{scrollbarStyles}</style>
      <div style={listStyles.container}>
        <div
          style={listStyles.header}
          className="d-flex justify-content-between align-items-center"
        >
          <h5 style={{ color: '#59167E' }}>주변 SOL집 찾기</h5>
          <Form.Select
            style={{
              width: '140px',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderRadius: '5px',
              borderImage:
                'linear-gradient(180deg, #A8B3F2 0%, #B690EE 21%, #F68EA3 57.5%, #FBAD7A 99.5%)',
              borderImageSlice: 1,
              WebkitMaskImage:
                'linear-gradient(180deg, #A8B3F2 0%, #B690EE 21%, #F68EA3 57.5%, #FBAD7A 99.5%)', 
            }}
          >
            <option>수익률순</option>
            <option>가격순</option>
            <option>최신순</option>
          </Form.Select>
        </div>
        <div style={listStyles.cardList} className="custom-scrollbar">
          <PropertyCard
            name="서울 강남구 A빌딩"
            image="/building_photo.jpg"
            price="5,000,000"
            tokenPrice="50,000"
            availableTokens="100"
            percentage="12.5"
          />
          <PropertyCard
            name="서울 성북구 B빌딩"
            image="/building_photo.jpg"
            price="5,000,000"
            tokenPrice="50,000"
            availableTokens="100"
            percentage="11.5"
          />
        </div>
      </div>
    </>
  );
};

export default PropertyList;
