import React from 'react';

function PropertyHeader({ name, address, price, priceChange }) {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="h3 fw-bold">{name}</h2>
            <p className="text-muted small">{address}</p>
          </div>
          <div className="text-end">
            <div className="h3 fw-bold text-danger">{price.toLocaleString()}</div>
            <div className="text-danger">{priceChange}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyHeader;

