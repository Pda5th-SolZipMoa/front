import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

const Map = ({ keyword, onSearchResults, selectedLocation }) => {
  const [loading, setLoading] = useState(false);
  const [markers, setMarkers] = useState([]);

  const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;

  const mapMarkerImage = 'map_marker.png'; // 커스텀 마커 이미지 경로

  const loadMapScript = () => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&libraries=services,clusterer&autoload=false`;
    script.async = true;

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const container = document.getElementById('map');
          const options = {
            center: new window.kakao.maps.LatLng(37.545178, 127.056847), // Default coordinates
            level: 3,
          };

          const map = new window.kakao.maps.Map(container, options);

          // Geolocation
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                const locPosition = new window.kakao.maps.LatLng(
                  latitude,
                  longitude,
                );

                const markerImage = new window.kakao.maps.MarkerImage(
                  mapMarkerImage, // 커스텀 마커 이미지
                  new window.kakao.maps.Size(32, 32), // 마커 크기 조정
                );

                const marker = new window.kakao.maps.Marker({
                  position: locPosition,
                  image: markerImage, // 커스텀 마커 이미지 설정
                });

                map.setCenter(locPosition);
                marker.setMap(map);
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

          // Save map instance globally for re-use
          window.map = map;
          setLoading(false);
          setMarkers([]);
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      setLoading(false);
      document.head.removeChild(script);
    };
  };

  const searchPlaces = () => {
    if (window.kakao && window.kakao.maps) {
      const map = window.map;
      const ps = new window.kakao.maps.services.Places();

      ps.keywordSearch(keyword, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          markers.forEach((marker) => marker.setMap(null));

          const newMarkers = [];
          const searchResults = data.map((place) => ({
            name: place.place_name,
            address: place.address_name,
            latitude: place.y,
            longitude: place.x,
          }));

          onSearchResults(searchResults);

          data.forEach((place) => {
            const position = new window.kakao.maps.LatLng(place.y, place.x);
            const markerImage = new window.kakao.maps.MarkerImage(
              mapMarkerImage, // 커스텀 마커 이미지
              new window.kakao.maps.Size(32, 32), // 마커 크기
            );

            const marker = new window.kakao.maps.Marker({
              position: position,
              image: markerImage, // 커스텀 마커 이미지 설정
            });

            marker.setMap(map);
            newMarkers.push(marker);
          });

          setMarkers(newMarkers);
        }
      });
    }
  };

  const moveToLocation = (location) => {
    if (window.map && location && window.kakao && window.kakao.maps) {
      const { latitude, longitude } = location;
      const newCenter = new window.kakao.maps.LatLng(latitude, longitude);
      window.map.setCenter(newCenter); // 지도 중심 이동

      // 커스텀 마커 추가
      const markerImage = new window.kakao.maps.MarkerImage(
        mapMarkerImage,
        new window.kakao.maps.Size(32, 32),
      );

      const marker = new window.kakao.maps.Marker({
        position: newCenter,
        image: markerImage,
      });

      marker.setMap(window.map);
    }
  };

  useEffect(() => {
    loadMapScript();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      moveToLocation(selectedLocation); 
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (keyword) {
      searchPlaces(); // 키워드가 변경되면 검색 함수 실행
    }
  }, [keyword]); 

  return (
    <Card className="mb-4" style={{ height: '100%', border: 'none' }}>
      {loading ? (
        <div
          className="text-center"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <div>
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5>지도를 불러오는 중입니다...</h5>
          </div>
        </div>
      ) : (
        <div
          id="map"
          style={{
            width: '100%',
            height: '100%',
          }}
        ></div>
      )}
    </Card>
  );
};

export default Map;
