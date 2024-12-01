import React from 'react';
import PropertyDetail from './PropertyDetail';
import GPTSummary from './GPTSummary';
import ChatGPT from './ChatGPT';
import InvestmentInfo from './InvestmentInfo';
import NearbySolHomes from './NearbySolHomes';
import Discussion from './Discussion';

function RealEstatePage() {
  return (
    <div className="min-vh-100 bg-light">
      <header className="bg-white shadow-sm">
        <div className="container py-4">
          <h1 className="h2 fw-semibold text-dark">부동산 상세 정보</h1>
        </div>
      </header>
      <main>
      <div className="container py-4">
        <div className="row">
            {/* 왼쪽 영역 */}
            <div className="col-lg-8">
                <PropertyDetail />
                <GPTSummary />
                <ChatGPT />
                <Discussion />
            </div>
            
            {/* 오른쪽 영역 */}
            <div className="col-lg-4">
                <InvestmentInfo />
                <NearbySolHomes />
            </div>
        </div>
    </div>
      </main>
      {/* <div className="container py-4">
        <ChatGPT />
      </div> */}
      <footer className="bg-white mt-5">
        <div className="container py-3">
          <p className="text-center text-muted small">© 2024 부동산 정보 서비스. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default RealEstatePage;

