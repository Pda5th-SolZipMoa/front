import React from 'react';

function NearbySolHomes() {
  const nearbyProperties = [
    { name: "서울강남구A빌딩", distance: "2.5km", price: "5,000원", change: "+12.5%" },
    { name: "서울 강남구 B빌딩", distance: "4.3km", price: "1,000원", change: "+11.5%" },
    { name: "서울강남구C빌딩", distance: "5.1km", price: "15,000원", change: "+12.5%" },
    { name: "서울강남구D빌딩", distance: "6.3km", price: "5,000원", change: "+20.9%" },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="h5 mb-0">주변 SOL집 둘러보기</h3>
      </div>
      <div className="card-body">
        {nearbyProperties.map((property, index) => (
          <div key={index} className="d-flex gap-3 mb-3">
            <div className="bg-light rounded" style={{width: '64px', height: '64px'}}></div>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between">
                <p className="fw-medium mb-0">{property.name} {property.distance}</p>
              </div>
              <p className="small text-muted mb-0">{property.price} / 1SOL</p>
              <p className="small text-success mb-0">{property.change}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NearbySolHomes;