import React, { useState } from 'react';
import {
  Container,
  Navbar,
  Form,
  Dropdown,
  Button,
  Tooltip,
  OverlayTrigger,
} from 'react-bootstrap';
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
    if (setSearchQuery) {
      setSearchQuery(event.target.value);
    }
  };

  const handleResultClick = (result) => {
    if (onSelectLocation) {
      onSelectLocation({
        latitude: result.latitude,
        longitude: result.longitude,
        name: result.name,
      });
    }
    if (setSearchQuery) {
      setSearchQuery('');
    }
    setPlaceholder(result.name);
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
            onClick={() => navigate('/main')}
            style={{ width: '40px', height: '40px', cursor: 'pointer' }}
          />
          <Navbar.Brand
            className="ms-2"
            onClick={() => navigate('/main')}
            style={{
              color: '#6f42c1',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              cursor: 'pointer',
            }}
          >
            SOL집모아
          </Navbar.Brand>
        </div>
        {/* 검색창 조건부 렌더링 */}
        {searchQuery !== undefined && setSearchQuery && (
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
                style={{ paddingLeft: '30px', borderRadius: '25px' }}
              />
              {searchQuery && searchResults && searchResults.length > 0 && (
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
        )}
        <div className="d-flex align-items-center justify-content-end flex-grow-1">
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>마이페이지</Tooltip>}
          >
            <img
              src="/mypage_icon.png"
              alt="마이페이지 아이콘"
              onClick={() => navigate('/mypage')}
              style={{ width: '40px', height: '40px', cursor: 'pointer' }}
            />
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>토큰 발행</Tooltip>}
          >
            <img
              src="/coin_logo.png"
              alt="토큰 발행 아이콘"
              onClick={() => navigate('/property_create')}
              style={{
                width: '38px',
                height: '38px',
                cursor: 'pointer',
                marginLeft: '15px',
              }}
            />
          </OverlayTrigger>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
