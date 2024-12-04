import React, { useEffect, useState } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import styled from 'styled-components';

const MapContainer = styled(Card)`
  height: 100%;
  border: none;
  background-color: #f3f0ff;
`;

const MapControls = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  display: flex;
  gap: 10px;
`;

const StyledButton = styled.button`
  background-color: ${(props) => (props.active ? '#6c63ff' : '#F3F0FF')};
  border: 2px solid #6c63ff;
  color: ${(props) => (props.active ? '#F3F0FF' : '#6c63ff')};
  padding: 5px 20px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;

  &:hover,
  &:focus {
    background-color: ${(props) => (props.active ? '#5b54e3' : '#e6e3ff')};
    border-color: ${(props) => (props.active ? '#5b54e3' : '#b3acff')};
    color: #f3f0ff;
    outline: none;
  }
`;

const Map = ({ data, filter, setFilter }) => {
  console.log(filter);
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState(null);
  const [buildingMarkers, setBuildingMarkers] = useState([]);

  const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;

  const mapMarkerImage = '/map_apt_marker.png';

  useEffect(() => {
    const loadMapScript = () => {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&libraries=services,clusterer&autoload=false`;
      script.async = true;

      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            const container = document.getElementById('map');
            const options = {
              center: new window.kakao.maps.LatLng(37.545178, 127.056847),
              level: 9,
            };
            const kakaoMap = new window.kakao.maps.Map(container, options);
            setMap(kakaoMap);
            setLoading(false);
          });
        }
      };

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    };

    loadMapScript();
  }, []);

  const clearMarkers = () => {
    buildingMarkers.forEach(({ marker, overlay }) => {
      if (marker) marker.setMap(null);
      if (overlay) overlay.setMap(null);
    });
    setBuildingMarkers([]);
  };

  const addMarker = ({ latitude, longitude, price }) => {
    if (!map) return null;

    const position = new window.kakao.maps.LatLng(latitude, longitude);

    const markerImage = new window.kakao.maps.MarkerImage(
      mapMarkerImage,
      new window.kakao.maps.Size(40, 40),
      { offset: new window.kakao.maps.Point(20, 40) }
    );

    const marker = new window.kakao.maps.Marker({
      position,
      image: markerImage,
    });

    marker.setMap(map);

    let overlay = null;
    if (price) {
      const overlayContent = `
        <div style="
          background-color: #AE70D0;
          color: #FFF;
          padding: 10px;
          border-radius: 5px;
          font-size: 14px;
          text-align: center;
          box-shadow: 0px 2px 4px rgba(0,0,0,0.2);
          margin-bottom: 25px;
        ">
          <div style="font-weight: bold;">실 거래가</div>
          <div>${(price / 10000).toLocaleString()}억 원</div>
        </div>
      `;

      overlay = new window.kakao.maps.CustomOverlay({
        content: overlayContent,
        position: position,
        yAnchor: 1.2,
        zIndex: 1, // 오버레이가 마커보다 위에 표시되도록 설정
      });

      overlay.setMap(map);
    }

    return { marker, overlay };
  };

  const addAllMarkers = (buildings) => {
    const newMarkers = buildings.map((building) =>
      addMarker({
        latitude: building.lat,
        longitude: building.lng,
        price: building.price,
      })
    );
    setBuildingMarkers(newMarkers);
  };

  useEffect(() => {
    if (!map || !data) return;

    clearMarkers();

    const filteredData = data.filter((item) => {
      if (filter === '전체') return true;
      if (filter === '청약') return item.status === 'pending';
      if (filter === '투자') return item.status === 'fulfilled';
      return false;
    });

    addAllMarkers(filteredData);
  }, [map, data, filter]);

  return (
    <MapContainer>
      {loading ? (
        <div className="d-flex align-items-center justify-content-center h-100">
          <Spinner animation="border" variant="primary" />
          <h5>지도를 불러오는 중입니다...</h5>
        </div>
      ) : (
        <div style={{ position: 'relative', height: '100%' }}>
          {/*
          <MapControls>
            {['전체', '청약', '투자'].map((btnFilter) => (
              <StyledButton
                key={btnFilter}
                active={filter === btnFilter}
                onClick={() => setFilter(btnFilter)}
              >
                {btnFilter}
              </StyledButton>
            ))}
          </MapControls>
            */}
          <div id="map" style={{ width: '100%', height: '100%' }}></div>
        </div>
      )}
    </MapContainer>
  );
};

export default Map;
