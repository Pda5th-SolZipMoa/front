import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function NewsSection() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // React Router로 전달된 state에서 buildingName 가져오기
  const location = useLocation();
  const { buildingData } = location.state || {};
  const buildingName = buildingData['건물정보']['건물명'];

  useEffect(() => {
    // FastAPI 백엔드에서 데이터 가져오기
    const fetchNews = async () => {
      try {
        const response = await axios.get('/api/news', {
          params: { query: buildingName || 'default' }, // buildingName을 쿼리로 사용
        });
        setNewsItems(response.data); // 데이터 상태에 저장
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [buildingName]);

  const handleMoreClick = () => {
    // "더보기" 버튼 클릭 시 다음 뉴스 검색 URL로 이동
    const searchQuery = buildingName || 'default'; // 검색어 기본값 설정
    window.location.href = `https://search.daum.net/search?w=news&q=${encodeURIComponent(
      searchQuery
    )}`;
  };

  // 로딩 스피너 컴포넌트
  const LoadingSpinner = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 38 38"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#666"
    >
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="2">
          <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
          <path d="M36 18c0-9.94-8.06-18-18-18">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </g>
    </svg>
  );

  if (loading) {
    return (
      <div className="card mt-4">
        <div className="card-header">
          <h3 className="h5 mb-0">News</h3>
        </div>
        <div className="card-body">
          <div
            className="p-3 rounded d-flex align-items-center"
            style={{
              backgroundColor: '#f5f5f5',
              color: '#666666',
              maxWidth: '100%',
              margin: '10px 0',
              fontSize: '0.9rem',
            }}
          >
            <LoadingSpinner />
            <p className="mb-0 ml-3" style={{ marginLeft: '12px' }}>
              뉴스를 불러오는 중...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="card-body text-danger">오류: {error}</div>;
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h3 className="h5 mb-0">News</h3>
        <button className="btn text-purple p-0" onClick={handleMoreClick}>
          더보기 &gt;
        </button>
      </div>
      <div className="card-body">
        {newsItems.length > 0 ? (
          newsItems.map((item, index) => (
            <div key={index} className="d-flex gap-3 mb-3">
              <div
                className="bg-light rounded"
                style={{
                  marginTop: '15px',
                  width: '150px',
                  height: '80px',
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              ></div>
              <div>
                <h4 className="h6 fw-medium">{item.title}</h4>
                <p className="small text-muted mb-1">{item.content}</p>
                <a
                  href={item.link}
                  className="small text-muted"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  원문 보기
                </a>
                <p className="small text-muted">{item.date}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">관련 뉴스 기사가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default NewsSection;
