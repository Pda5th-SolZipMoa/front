// DetailIndex.jsx 또는 PropertyDetail.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import ScheduleButton from './ScheduleButton';
import DetailBox from './DetailBox';
import DetailCategory from './DetailCategory';

export default function PropertyDetail() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [buildingData, setBuildingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL에서 ID 받아오기
  const { id } = useParams();

  useEffect(() => {
    const fetchBuildingData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/building-latest-transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: parseInt(id) }),
        });
        if (response.ok) {
          const data = await response.json();
          setBuildingData(data);

          // 이미지 URL 설정
          const imageUrls = data['건물정보']['이미지URL'];
          if (imageUrls && imageUrls.length > 0) {
            setSelectedImage(imageUrls[0]); // 첫 번째 이미지를 메인 이미지로 설정
            setThumbnails(imageUrls); // 전체 이미지 목록을 썸네일로 설정
          } else {
            // 이미지가 없을 경우 기본 이미지 사용
            const defaultImage = '/placeholder.svg?height=400&width=600';
            setSelectedImage(defaultImage);
            setThumbnails([defaultImage]);
          }
        } else {
          const errorData = await response.json();
          setError(errorData.detail || '데이터를 가져오는데 실패했습니다.');
        }
      } catch (error) {
        setError('서버와의 통신 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchBuildingData();
  }, [id]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러 발생: {error}</div>;
  }

  return (
    <Container className="py-4">
      <ScheduleButton />

      <Row>
        {/* Left Column - Images */}
        <Col md={7}>
          <div className="position-relative mb-3">
            <Image
              src={selectedImage}
              alt="Main property view"
              className="w-100 rounded"
              style={{ height: '400px', objectFit: 'cover' }}
            />
          </div>
          <Row className="g-2">
            {thumbnails.map((thumb, idx) => (
              <Col key={idx} xs={3}>
                <Image
                  src={thumb}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-100 rounded cursor-pointer"
                  style={{ height: '80px', objectFit: 'cover' }}
                  onClick={() => setSelectedImage(thumb)}
                />
              </Col>
            ))}
          </Row>
        </Col>

        {/* Right Column - Details */}
        <Col md={5}>
          <DetailBox buildingData={buildingData} />
        </Col>
      </Row>

      <DetailCategory buildingData={buildingData} />
    </Container>
  );
}
