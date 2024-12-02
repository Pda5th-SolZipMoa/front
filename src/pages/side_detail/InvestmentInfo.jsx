import React from 'react';
import { Building, GeoAlt, GraphUp } from 'react-bootstrap-icons';

function InvestmentInfo() {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="mb-3">
          <div className="d-flex gap-2 align-items-center mb-2">
            <Building className="text-purple" size={20} />
            <div>
              <p className="fw-medium mb-0">건물규모</p>
              <p className="small text-muted mb-0">지상 20층, 지하3층</p>
            </div>
          </div>
          <div className="d-flex gap-2 align-items-center mb-2">
            <GeoAlt className="text-purple" size={20} />
            <div>
              <p className="fw-medium mb-0">위치</p>
              <p className="small text-muted mb-0">서울특별시서울구</p>
            </div>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <GraphUp className="text-purple" size={20} />
            <div>
              <p className="fw-medium mb-0">현재 시세</p>
              <p className="small text-muted mb-0">5,000,000원/3.3㎡</p>
            </div>
          </div>
        </div>
        <button className="btn btn-purple w-100">투자하기</button>
      </div>
    </div>
  );
}

export default InvestmentInfo;

