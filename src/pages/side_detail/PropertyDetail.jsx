import React from 'react';
import PropertyHeader from './PropertyHeader';
import PriceHistory from './PriceHistory';
import NewsSection from './NewsSection';
import InvestmentInfo from './InvestmentInfo';
import NearbySolHomes from './NearbySolHomes';
import { useLocation } from 'react-router-dom';

function PropertyDetail() {
  const location = useLocation();
  const { buildingData } = location.state || {};  
  return (
    <div className="row g-4">
      <div>
        <PropertyHeader 
          name={buildingData['건물정보']['건물명']}
          address={buildingData['건물정보']['주소']}
          code={buildingData['건물정보']['빌딩코드']}
        />
        {/* <PriceHistory /> */}
        <NewsSection />
      </div>
    </div>
  );
}

export default PropertyDetail;

