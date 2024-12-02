import React, { useState, useEffect } from 'react';

function NewsSection() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // FastAPI 백엔드에서 '서울숲 트리마제' 뉴스 데이터 가져오기
    fetch("http://localhost:8000/api/news")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch news data");
        return res.json();
      })
      .then((data) => {
        setNewsItems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleMoreClick = () => {
    // "더보기" 버튼 클릭 시 다음 뉴스 검색 URL로 이동
    window.location.href = "https://search.daum.net/search?w=news&q=서울숲트리마제";
  };

  if (loading) {
    return <div className="card-body">뉴스를 불러오는 중...</div>;
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
                  marginTop: "15px",
                  width: "150px",
                  height: "80px",
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
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