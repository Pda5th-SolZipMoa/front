import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

const Map = () => {
  const [loading, setLoading] = useState(true);

  const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;

  useEffect(() => {
    const loadMapScript = () => {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false`;
      script.async = true;

      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            const container = document.getElementById('map');
            const options = {
              center: new window.kakao.maps.LatLng(37.545178, 127.056847), // 초기 위도 경도 설정
              level: 3,
            };

            const map = new window.kakao.maps.Map(container, options);

            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  const locPosition = new window.kakao.maps.LatLng(
                    latitude,
                    longitude,
                  );

                  const imageSrc = '/map_marker.png';
                  const imageSize = new window.kakao.maps.Size(40, 40);
                  const imageOption = {
                    offset: new window.kakao.maps.Point(20, 40),
                  }; 

                  const marker = new window.kakao.maps.Marker({
                    position: locPosition,
                    image: new window.kakao.maps.MarkerImage(
                      imageSrc,
                      imageSize,
                      imageOption,
                    ),
                  });

                  map.setCenter(locPosition);
                  marker.setMap(map);

                  const infowindow = new window.kakao.maps.InfoWindow({
                    removable: true,
                  });

                  infowindow.close();
                  setLoading(false);
                },
                (error) => {
                  console.error('Error getting location:', error);
                  setLoading(false);
                },
              );
            } else {
              console.warn('Geolocation not supported');
              setLoading(false);
            }
          });
        }
      };

      document.head.appendChild(script);

      return () => {
        setLoading(false);
        document.head.removeChild(script);
      };
    };

    loadMapScript();
    setLoading(false);
  }, []);

  return (
    <Card className="mb-4">
      <Card.Body
        className="d-flex align-items-center justify-content-center"
        style={{ height: 'calc(100vh - 100px)' }}
      >
        <div className="text-center" style={{ width: '100%', height: '100%' }}>
          {loading ? (
            <>
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5>지도를 불러오는 중입니다</h5>
              <p className="text-muted">잠시만 기다려주세요...</p>
            </>
          ) : (
            <div id="map" style={{ width: '100%', height: '100%' }}></div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Map;
