import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

const Map = ({ keyword, onSearchResults, selectedLocation }) => {
  const [loading, setLoading] = useState(false);
  const [markers, setMarkers] = useState([]);

  const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;

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

                const marker = new window.kakao.maps.Marker({
                  position: locPosition,
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
            const marker = new window.kakao.maps.Marker({
              position: position,
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
    if (window.map && location) {
      const { latitude, longitude } = location;
      const newCenter = new window.kakao.maps.LatLng(latitude, longitude);
      window.map.setCenter(newCenter); // 지도 중심 이동
    }
  };

  useEffect(() => {
    loadMapScript();
  }, []);

  useEffect(() => {
    if (keyword) {
      searchPlaces();
    }
  }, [keyword]);

  useEffect(() => {
    if (selectedLocation) {
      moveToLocation(selectedLocation); // 선택된 위치로 이동
    }
  }, [selectedLocation]);

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
