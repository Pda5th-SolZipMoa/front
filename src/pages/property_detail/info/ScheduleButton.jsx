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
    </Nav>
  );
}
