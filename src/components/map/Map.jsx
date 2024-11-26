import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';

const Map = ({ keyword, onSearchResults, selectedLocation, data }) => {
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(null); // Kakao Map 객체
  const [buildingMarkers, setBuildingMarkers] = useState([]); // 빌딩 마커 배열
  const [searchMarker, setSearchMarker] = useState(null); // 현재 선택된 검색 마커

  const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;

  const mapMarkerImage = '/map_apt_marker.png'; // 커스텀 마커 이미지
  const searchMarkerImage = '/map_marker.png'; // 검색 마커 이미지

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

    setLoading(false);
    loadMapScript();
  }, []);

  // 모든 빌딩 마커 제거
  const clearBuildingMarkers = () => {
    buildingMarkers.forEach((marker) => marker.setMap(null));
    setBuildingMarkers([]);
  };

  // 검색 마커 제거
  const clearSearchMarker = () => {
    if (searchMarker) {
      searchMarker.setMap(null);
      setSearchMarker(null);
    }
  };

  // 단일 마커 추가
  const addMarker = ({ latitude, longitude, type, price }) => {
    if (!map) return;

    const position = new window.kakao.maps.LatLng(latitude, longitude);

    const markerImageSrc =
      type === 'search' ? searchMarkerImage : mapMarkerImage;
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

  // 현 위치로 이동
  const moveToCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation을 지원하지 않는 브라우저입니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const positionLatLng = new window.kakao.maps.LatLng(
          latitude,
          longitude,
        );
        map.setCenter(positionLatLng);
        map.setLevel(4);

        addMarker({
          latitude,
          longitude,
          type: 'search',
        });
      },
      (error) => {
        console.error('Error getting current location:', error);
        alert('현재 위치를 가져올 수 없습니다.');
      },
    );
  };

  // 선택된 장소 이동 및 검색 마커 추가
  useEffect(() => {
    if (selectedLocation) {
      addMarker({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        type: 'search', // 검색 마커
      });

      // 지도 중심 이동
      const position = new window.kakao.maps.LatLng(
        selectedLocation.latitude,
        selectedLocation.longitude,
      );
      map.setCenter(position);
      map.setLevel(4);
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
    if (keyword && map) {
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(keyword, (results, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const formattedResults = results.map((result) => ({
            name: result.place_name,
            address: result.address_name,
            latitude: parseFloat(result.y),
            longitude: parseFloat(result.x),
          }));
          map.setLevel(4);
          onSearchResults(formattedResults); // 부모 컴포넌트로 검색 결과 전달
        } else {
          console.error('검색 결과가 없습니다.');
          onSearchResults([]); // 검색 결과 없음 처리
        }
      });
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
        <div style={{ position: 'relative', height: '100%' }}>
          {/* 지도 영역 */}
          <div
            id="map"
            style={{
              width: '100%',
              height: '100%',
            }}
          ></div>

          {/* 위치 이동 버튼 */}
          <Button
            variant="primary"
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              zIndex: 1000,
              background:
                'linear-gradient(117deg, #AE70D0 7.71%, #B690EE 38.78%, #F68EA3 66.59%)',
              border: 'none',
              color: '#fff',
            }}
            onClick={moveToCurrentLocation}
          >
           현 위치로 이동
          </Button>
        </div>
      )}
    </Card>
  );
};

export default Map;
