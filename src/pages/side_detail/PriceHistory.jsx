import React from 'react';

function PriceHistory() {
  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3 className="h5 mb-0">공시지가</h3>
      </div>
      <div className="card-body">
        <p className="small">최근 3년간 <span className="text-danger fw-bold">37.1%</span> 이상 상승했어요</p>
        <div className="bg-light rounded" style={{height: '200px'}}>
          {/* 차트 플레이스홀더 */}
        </div>
      </div>
    </div>
  );
}

export default PriceHistory;

