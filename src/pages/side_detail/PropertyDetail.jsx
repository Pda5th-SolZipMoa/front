import React from 'react';
import PropertyHeader from './PropertyHeader';
import PriceHistory from './PriceHistory';
import NewsSection from './NewsSection';
import InvestmentInfo from './InvestmentInfo';
import NearbySolHomes from './NearbySolHomes';

function PropertyDetail() {
  return (
    <div className="row g-4">
      <div>
        <PropertyHeader 
          name="서울숲 트리마제"
          address="서울특별시 성동구 왕십리로 16"
          price={53000}
          priceChange={9.47}
        />
        <PriceHistory />
        <NewsSection />
      </div>
      {/* <div className="col-lg-4">
        <InvestmentInfo />
        <NearbySolHomes />
      </div> */}
    </div>
  );
}

export default PropertyDetail;

