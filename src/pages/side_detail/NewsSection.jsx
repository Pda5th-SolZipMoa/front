import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Card, Button, Spinner, Alert, Container, Row, Col } from "react-bootstrap";
import { ArrowRight } from 'react-bootstrap-icons';
// import "bootstrap/dist/css/bootstrap.min.css";
import "./NewsSection.css"; // We'll create this file for custom styles

function NewsSection() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const { buildingData } = location.state || {};
  const buildingName = buildingData?.['건물정보']?.['건물명'];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("/api/news", {
          params: { query: buildingName || "default" },
        });
        setNewsItems(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [buildingName]);

  const handleMoreClick = () => {
    const searchQuery = buildingName || "default";
    window.open(`https://search.daum.net/search?w=news&q=${encodeURIComponent(searchQuery)}`, '_blank');
  };

  return (
    <Container className="mt-5">
      {/* Always show the title */}
      <div className="d-flex justify-content-between align-items-center mb-4">
      <h4 className="card-title h5" style={{color:"#6C63FF"}}>최신 뉴스</h4>
        <Button 
          variant="link"
          onClick={handleMoreClick}
          className="text-decoration-none"
        >
          더보기 <ArrowRight />
        </Button>
      </div>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">뉴스를 불러오는 중...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="rounded-3">
          오류: {error}
        </Alert>
      ) : (
        newsItems.length > 0 ? (
          <Row xs={1} md={2} lg={3} className="g-4">
            {newsItems.map((item, index) => (
              <Col key={index}>
                <Card className="h-100 border-0 news-card">
                  <div 
                    className="card-img-top news-image" 
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="h5 mb-3">{item.title}</Card.Title>
                    <Card.Text className="text-muted mb-3 flex-grow-1">
                      {item.content}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <Button 
                        // variant="danger" 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="rounded-pill px-3 py-1 custom-button"
                      >
                        원문 보기
                      </Button>
                      <small className="text-muted">{item.date}</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Alert variant="info" className="rounded-3">
            관련 뉴스 기사가 없습니다.
          </Alert>
        )
      )}
    </Container>
  );
}

export default NewsSection;
