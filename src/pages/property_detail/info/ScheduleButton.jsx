import { Nav } from 'react-bootstrap';

export default function ScheduleButton() {
  return (
    <Nav className="mb-4">
      {/* 첫 번째 버튼 - 보라색 */}
      <Nav.Item>
        <Nav.Link
          className="text-white rounded-pill px-3 me-2"
          style={{
            backgroundColor: '#7F3FFC', // 보라색 HEX 코드
            textAlign: 'center',
          }}
        >
          D-Day
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
