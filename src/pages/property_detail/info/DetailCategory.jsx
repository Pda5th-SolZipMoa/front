import './info.css';
import React, { useEffect, useState } from 'react';
import { Row, Col, Table, ListGroup, Modal, Button } from 'react-bootstrap';

export default function DetailCategory({
  buildingData,
  onSelectDetail,
  selectedDetail,
  showModal,
  onCloseModal,
}) {
  const [map, setMap] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  if (!buildingData) {
    return <div>로딩 중...</div>;
  }
  const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;

  const buildingInfo = buildingData['건물정보'];
  const latestTransactions = buildingData['최신거래'];

  // 건물 정보 추출
  const {
    대지면적: platArea,
    건폐율: bcRat,
    연면적: totArea,
    용적률: vlRat,
    주소: buildAddress,
    매물목록: propertyDetails,
    건물명: buildingName,
  } = buildingInfo;

  // Kakao Map 스크립트 로드 및 지도 초기화
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&libraries=services&autoload=false`;
    script.async = true;

    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 기본값은 서울 시청
          level: 3,
        };
        const mapInstance = new window.kakao.maps.Map(container, options);
        setMap(mapInstance);
        setMapLoaded(true);
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // 지도 로드 후 주소로 위치 검색 및 마커 표시
  useEffect(() => {
    if (mapLoaded && map && buildAddress) {
      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(buildAddress, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          map.setCenter(coords);

          new window.kakao.maps.Marker({
            map: map,
            position: coords,
          });
        } else {
          console.error('주소 검색 실패:', status);
        }
      });
    }
  }, [mapLoaded, map, buildAddress]);

  // 리스트 아이템 클릭 핸들러
  const handleItemClick = (detail) => {
    onSelectDetail(detail); // 선택된 매물 정보를 상위 컴포넌트로 전달
  };

  return (
    <>
      {/* 매물 리스트 */}
      <div className="mt-5 p-4" style={{ backgroundColor: 'white', borderRadius: '8px' }}>
        <p className="common-title">매물 리스트</p>
        <div className="common-line"></div>
        <ListGroup className="mt-4">
          {propertyDetails && propertyDetails.length > 0 ? (
            propertyDetails.map((detail, idx) => (
              <ListGroup.Item key={idx} action onClick={() => handleItemClick(detail)}>
                {buildingName} - {detail['집 평수']}평, {detail['층수']}층
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item>등록된 매물이 없습니다.</ListGroup.Item>
          )}
        </ListGroup>
      </div>

      {/* 상세 정보 모달 */}
      {selectedDetail && (
        <Modal show={showModal} onHide={onCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {buildingName} - {selectedDetail['집 평수']}평/{selectedDetail['층수']}층 상세 정보
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>기본 정보</h5>
            <p>층수: {selectedDetail['층수']} 층</p>
            <p>방 개수: {selectedDetail['방 개수']} (방/화장실)</p>
            <p>유지비: {selectedDetail['유지비']} 만원</p>
            <p>집 평수: {selectedDetail['집 평수']} 평</p>

            <h5 className="mt-4">이미지</h5>
            <Row>
              {selectedDetail['이미지URL'] && selectedDetail['이미지URL'].length > 0 ? (
                selectedDetail['이미지URL'].map((url, idx) => (
                  <Col key={idx} md={4} className="mb-3">
                    <img
                      src={`http://localhost:8000/${url}`}
                      alt={`이미지 ${idx + 1}`}
                      style={{ width: '100%', borderRadius: '8px' }}
                    />
                  </Col>
                ))
              ) : (
                <p>이미지가 없습니다.</p>
              )}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onCloseModal}>
              닫기
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* 건물 정보 */}
      <div className="mt-5 p-4" style={{ backgroundColor: 'white', borderRadius: '8px' }}>
        <p className="common-title">건물 정보</p>
        <div className="common-line"></div>
        <Row className="mt-4">
          <Col md={8}>
            <Row>
              <Col md={6}>
                <div className="mb-4">
                  <h6 className="text-muted mb-2">연면적</h6>
                  <p>{totArea} m²</p>
                </div>
                <div className="mb-4">
                  <h6 className="text-muted mb-2">용적률</h6>
                  <p>{vlRat}%</p>
                </div>
              </Col>

              <Col md={6}>
                <div className="mb-4">
                  <h6 className="text-muted mb-2">대지면적</h6>
                  <p>{platArea} m²</p>
                </div>
                <div className="mb-4">
                  <h6 className="text-muted mb-2">건폐율</h6>
                  <p>{bcRat}%</p>
                </div>
              </Col>
            </Row>
          </Col>
          <Col
            md={4}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              overflow: 'hidden',
              marginLeft: '-40px',
            }}
          >
            <h6 className="mb-2">주소</h6>
            <p className="mb-3">{buildAddress}</p>
            <div
              id="map"
              style={{
                width: '100%',
                maxWidth: '300px',
                height: '250px',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            ></div>
          </Col>
        </Row>
      </div>

      {/* 시세 정보 */}
      <div className="mt-5 p-4" style={{ backgroundColor: 'white', borderRadius: '8px' }}>
        <p className="common-title">시세 정보</p>
        <div className="common-line"></div>
        <div className="mt-4">
          <Table hover borderless>
            <thead>
              <tr>
                <th>계약일자</th>
                <th>거래금액</th>
                <th>전용면적</th>
                <th>층</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(latestTransactions) ? (
                latestTransactions.map((transaction, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-light' : ''}>
                    <td>{transaction['계약일자']}</td>
                    <td>{transaction['거래금액']} 억원</td>
                    <td>{transaction['전용면적']} m²</td>
                    <td>{transaction['층']} 층</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">최근 거래 내역이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}
