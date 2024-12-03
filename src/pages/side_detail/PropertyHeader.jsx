import React from 'react';

function PropertyHeader({ name, address,code }) {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="h3 fw-bold">{name}</h2>
            <p className="text-bold large">{address}</p>
            <p className="text-muted small"> 건물 번호: {code || '해당 코드 정보가 없습니다'}</p>

          </div>
          <div className="text-end">
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyHeader;