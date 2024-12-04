import { useState, useEffect } from 'react';
import { useParams,useNavigate,useLocation } from 'react-router-dom';
import { Container, Row, Col, Image,Button } from 'react-bootstrap';
import ScheduleButton from './ScheduleButton';
import DetailBox from './DetailBox';
import DetailCategory from './DetailCategory';
import Header from '../../../components/header/Header';
import axios from 'axios';


export default function PropertyDetail() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [buildingData, setBuildingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate(); // useNavigate 훅 추가
  const location = useLocation();
  


  // 추가된 상태
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // URL에서 ID 받아오기
  const { id } = useParams();

  useEffect(() => {
    const fetchBuildingData = async () => {
      try {
        const response = await axios.get(`/api/building-latest-transactions/${id}`);

        if (response.status === 200) {
          const data = response.data;
          setBuildingData(data);
          
          // 이미지 URL 설정
          let imageUrls = data['건물정보']['건물사진'];

          if (imageUrls && imageUrls.length > 0) {
            // imageUrls가 문자열이면 배열로 변환
            if (typeof imageUrls === 'string') {
              imageUrls = [imageUrls];
            }
            
            const fullImageUrls = imageUrls.map((url) => `http://3.37.185.91:8000/${url}`);
            setSelectedImage(fullImageUrls[0]);
            setThumbnails(fullImageUrls);
          } else {
            const defaultImage = '/placeholder.svg?height=400&width=600';
            setSelectedImage(defaultImage);
            setThumbnails([defaultImage]);
          }

          // 매물 목록에서 첫 번째 매물의 이미지 가져오기
          const propertyDetails = data['건물정보']['매물목록'];
          if (propertyDetails && propertyDetails.length > 0) {
            const firstDetail = propertyDetails[0];
            try {
              // 이미지 데이터 가져오기
              const imageResponse = await axios.get(`/api/property-detail-images/${firstDetail.id}`);
              if (imageResponse.status === 200) {
                const images = imageResponse.data['이미지URL'];
                const detailWithImages = {
                  ...firstDetail,
                  '이미지URL': images,
                };
                setSelectedDetail(detailWithImages);
              } else {
                console.error('이미지 데이터를 가져오는데 실패했습니다.');
                setSelectedDetail(firstDetail);
              }
            } catch (error) {
              console.error('이미지 데이터를 가져오는 중 오류가 발생했습니다.', error);
              setSelectedDetail(firstDetail);
            }
          }
        } else {
          setError('데이터를 가져오는데 실패했습니다.');
        }
      } catch (error) {
        setError('서버와의 통신 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBuildingData();
  }, [id]);
  
  // 매물 선택 핸들러
  const handleSelectDetail = async (detail) => {
    try {
      // 이미지 데이터 가져오기
      const imageResponse = await axios.get(`/api/property-detail-images/${detail.id}`);
      if (imageResponse.status === 200) {
        const images = imageResponse.data['이미지URL'];
        const detailWithImages = {
          ...detail,
          '이미지URL': images,
        };
        setSelectedDetail(detailWithImages);
      } else {
        console.error('이미지 데이터를 가져오는데 실패했습니다.');
        setSelectedDetail(detail);
      }
    } catch (error) {
      console.error('이미지 데이터를 가져오는 중 오류가 발생했습니다.', error);
      setSelectedDetail(detail);
    }
    setShowModal(true);
  };
  
  

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSearch = (query) => {
    // 검색어에 따라 검색 결과를 설정하는 로직 추가
    const dummyResults = [
      { name: '예제 위치 1', address: '서울특별시 중구 예제로 1', latitude: 37.5665, longitude: 126.978 },
      { name: '예제 위치 2', address: '서울특별시 강남구 테헤란로 2', latitude: 37.498, longitude: 127.027 },
    ];
    setSearchResults(dummyResults.filter((item) => item.name.includes(query)));
  };

  const handleSelectLocation = (location) => {
    console.log('선택된 위치:', location);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러 발생: {error}</div>;
  }

  // 건물이름과 주소를 전달하는 함수
  const handleApply = () => {
    if (buildingData && buildingData['건물정보']) {
      // const buildingName = buildingData['건물정보']['건물명'];
      // const address = buildingData['건물정보']['주소'];
      console.log(buildingData)
      // 데이터와 함께 새로운 경로로 이동
      navigate('/property_sidedetail', {
        state: {
          buildingData
        },
      });
    } else {
      console.error('건물 정보를 찾을 수 없습니다.');
    }
  };

  
  return (
    <div style={{ backgroundColor: '#FAF8FF', minHeight: '100vh' }}>
      {/* Header 추가 */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={(query) => {
          setSearchQuery(query);
          handleSearch(query);
        }}
        searchResults={searchResults}
        onSelectLocation={handleSelectLocation}
      />

      {/* 본문 */}
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
            <DetailBox buildingData={buildingData} selectedDetail={selectedDetail} />
          </Col>

        </Row>

        <DetailCategory
          buildingData={buildingData}
          onSelectDetail={handleSelectDetail}
          selectedDetail={selectedDetail}
          showModal={showModal}
          onCloseModal={handleCloseModal}
        />
      </Container>
    </div>
  );
}