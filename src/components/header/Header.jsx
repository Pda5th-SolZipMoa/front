import React from 'react';
import { Container, Navbar, Button, Form } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import custom_header from './header.module.css';

export default function Header() {
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
              className={`position-absolute ${custom_header.searchIcon}`}
              style={{
                top: '50%',
                left: '5px',
                transform: 'translateY(-50%)',
                color: '#6c757d',
                fontSize: '1.2rem',
                zIndex: 0,
              }}
            />
            <Form.Control
              type="search"
              placeholder="찾고 싶은 물건을 검색해보세요..."
              aria-label="검색"
              className={`ps-4 ${custom_header.search}`}
              style={{
                paddingLeft: '30px',
              }}
            />
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
            <span className="ms-2">마이페이지</span>
          </Button>
          <Button
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
}
