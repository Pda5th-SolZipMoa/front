import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

const Map = ({ keyword, onSearchResults, selectedLocation, data }) => {
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(null); // Kakao Map 객체
  const [buildingMarkers, setBuildingMarkers] = useState([]); // 빌딩 마커 배열
  const [searchMarker, setSearchMarker] = useState(null); // 현재 선택된 검색 마커

  const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;

  const mapMarkerImage = '/map_apt_marker.png'; // 커스텀 마커 이미지

  // Kakao Maps 스크립트 로드
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
              level: 3,
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

      setLoading(false);
    loadMapScript();
  }, []);

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

  // 단일 마커 추가
  const addMarker = ({ latitude, longitude, type, price }) => {
    if (!map) return;

    const position = new window.kakao.maps.LatLng(latitude, longitude);

    const markerImageSrc = mapMarkerImage;
    const markerImage = new window.kakao.maps.MarkerImage(
      markerImageSrc,
      new window.kakao.maps.Size(40, 40),
      { offset: new window.kakao.maps.Point(20, 40) },
    );

    const marker = new window.kakao.maps.Marker({
      position,
      image: markerImage,
    });

    // 마커 표시
    marker.setMap(map);

    // 가격 오버레이 추가
    if (price) {
      const content = `
        <div style="
          background-color: #FFCF0D;
          padding: 10px;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          font-size: 14px;
          text-align: center;
          line-height: 1.5;
          margin-bottom: 50px;
        ">
          <div style="font-weight: bold;">공모 금액</div>
          <div>${(price / 10000).toLocaleString()}억 원</div>
        </div>
      `;

      const overlay = new window.kakao.maps.CustomOverlay({
        map: map,
        position: position,
        content: content,
        yAnchor: 1,
        zIndex: 10,
      });

      overlay.setMap(map);
    }

    // 상태 업데이트
    if (type === 'building') {
      setBuildingMarkers((prevMarkers) => [...prevMarkers, marker]);
    } else if (type === 'search') {
      clearSearchMarker(); // 이전 검색 마커 제거
      setSearchMarker(marker); // 새 검색 마커 저장
    }
  };

  // 모든 빌딩 마커 추가
  const addAllMarkers = (buildings) => {
    buildings.forEach((building) => {
      addMarker({
        latitude: building.lat,
        longitude: building.lng,
        price: building.price,
        type: 'building', // 빌딩 마커
      });
    });
  };

  // 선택된 장소 이동 및 검색 마커 추가
  useEffect(() => {
    if (selectedLocation) {
      moveToLocation(selectedLocation);
    }
  }, [selectedLocation]);

  // 데이터 변경 시 초기 빌딩 마커 설정
  useEffect(() => {
    if (data && data.length > 0) {
      addAllMarkers(data);
    }
  }, [data]);

  // 키워드 검색 시 처리
  useEffect(() => {
    if (keyword) {
      searchPlaces(); // 키워드가 변경되면 검색 함수 실행
    }
  }, [keyword, map]);

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
