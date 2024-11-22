import { Nav } from "react-bootstrap";

export default function ScheduleButton() {
  return (
    <Nav className="mb-4">
      {/* 첫 번째 버튼 - 파란색 */}
      <Nav.Item>
        <Nav.Link
          className="bg-primary text-white rounded-pill px-3 me-2"
          style={{ textAlign: "center" }}
        >
          D-9
        </Nav.Link>
      </Nav.Item>

      {/* 두 번째 버튼 - 연한 파란색 */}
      <Nav.Item>
        <Nav.Link
          className="bg-light text-primary rounded-pill px-3 me-2"
          style={{textAlign: "center" }}
        >
          공모 예정
        </Nav.Link>
      </Nav.Item>

      {/* 세 번째 버튼 - 연한 초록색 */}
      <Nav.Item>
        <Nav.Link
          className="bg-success bg-opacity-10 text-success rounded-pill px-3"
          style={{ textAlign: "center" }}
        >
          선착순 청약
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
