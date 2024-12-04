import React from 'react';
import PropertyDetail from './PropertyDetail';
import GPTSummary from './GPTSummary';
import ChatGPT from './ChatGPT';
import InvestmentInfo from './InvestmentInfo';
import NearbySolHomes from './NearbySolHomes';
import Header from '../../components/header/Header';

function RealEstatePage() {
  return (
    <div className="min-vh-100" style={{ backgroundColor: 'rgb(256, 256, 256)' }}>
      {/* 공통 Header 추가 */}
      <Header />
      <main>
        <div className="container py-4">
          <div className="row">
            {/* 왼쪽 영역 */}
            <div className="col-lg-8">
              <PropertyDetail />
              <GPTSummary />
            </div>

            {/* 오른쪽 영역 */}
            <div className="col-lg-4">
              <InvestmentInfo />
              <ChatGPT />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RealEstatePage;
