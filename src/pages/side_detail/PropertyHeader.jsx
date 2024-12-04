import React from 'react';
import './PropertyHeader.css';

function PropertyHeader({ name, address, code }) {
  return (
    <div className="property-header-card mb-4">
      <div className="property-header-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
          <h4 className="card-title h3" style={{color:"#5A287D"}}>{name}</h4>
            <p className="text-dark large">{address}</p>
            <p className="text-muted small">건물 번호: {code || '해당 코드 정보가 없습니다'}</p>
          </div>
          <div className="text-end">
            {/* 버튼이나 추가적인 내용이 필요한 경우 여기에 작성 */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyHeader;
