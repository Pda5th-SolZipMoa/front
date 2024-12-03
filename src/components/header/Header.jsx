import React, { useState } from 'react';
import { Container, Navbar, Form, Dropdown, Button } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import custom_header from './Header.module.css';
import { useNavigate } from 'react-router-dom';

const Header = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  onSelectLocation,
}) => {
  const [placeholder, setPlaceholder] = useState('검색어 입력');
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleResultClick = (result) => {
    onSelectLocation({
      latitude: result.latitude,
      longitude: result.longitude,
      name: result.name,
    });
    setSearchQuery('');
    setPlaceholder(result.name); // Placeholder 업데이트
  };

  const navigate = useNavigate();

  return (
    <Navbar bg="white" expand="lg" className="border-bottom">
      <Container className={`d-flex flex-wrap ${custom_header.container}`}>
        <div className="d-flex align-items-center mb-2 mb-lg-0">
          <img
            src="/main_logo.png"
            alt="SOL집모아 로고"
            className={custom_header.header}
            style={{ width: '40px', height: '40px' }}
          />
          <Navbar.Brand
            href="#home"
            className="ms-2"
            style={{
              color: '#6f42c1',
              fontWeight: 'bold',
              fontSize: '1.2rem',
            }}
          >
            SOL집모아
          </Navbar.Brand>
        </div>
        <Form
          className="d-flex flex-grow-1 position-relative mx-lg-auto mb-2 mb-lg-0"
          style={{
            maxWidth: '500px',
            minWidth: '300px',
          }}
        >
          <div className="position-relative w-100">
            <Search
              style={{ position: 'absolute', top: '10px', left: '10px' }}
            />
            <Form.Control
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={handleSearchChange}
              style={{ paddingLeft: '30px' }}
            />
            {searchQuery && searchResults.length > 0 && (
              <Dropdown.Menu
                show
                style={{ width: '100%', position: 'absolute', top: '40px' }}
              >
                {searchResults.map((result, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => handleResultClick(result)}
                  >
                    {result.name} - {result.address}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            )}
          </div>
        </Form>
        <div className="d-flex align-items-center justify-content-end flex-grow-1">
          <Button
            variant="link"
            className="d-flex align-items-center me-3 p-0"
            aria-label="알림 보기"
          >
            <img
              src="/header_bell.png"
              alt="알림 아이콘"
              style={{ width: '28px', height: '28px' }}
            />
            <span className="ms-2">알림</span>
          </Button>
          <Button
            variant="link"
            className="d-flex align-items-center me-3 p-0"
            aria-label="마이페이지로 이동"
          >
            <img
              src="/header_myicon.png"
              alt="마이페이지 아이콘"
              style={{ width: '30px', height: '28px' }}
            />
            <span
              className="ms-2"
              onClick={() => {
                navigate('/mypage');
              }}
            >
              마이페이지
            </span>
          </Button>
          <Button
            onClick={() => {
              navigate('/property_create');
            }}
            style={{
              backgroundColor: '#6f42c1',
              color: 'white',
              fontSize: '0.9rem',
              padding: '0.5rem 1rem',
            }}
            aria-label="토큰 발행하기"
          >
            토큰 발행
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
