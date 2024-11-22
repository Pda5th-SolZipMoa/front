import './info.css'
import { Nav, Row, Col, Table, Image } from 'react-bootstrap'

export default function DetailCategory() {
  return (
    <>
    <div className="mt-5">
    <p className="common-title">토큰 발행정보</p>
    <div className="common-line"></div>
    </div>

      <Row className="mt-4">
        <Col md={6}>
          <Table borderless>
            <tbody>
              <tr>
                <td className="text-muted">청약 기간</td>
                <td>2024.11.27-2024.12.10</td>
              </tr>
              <tr>
                <td className="text-muted">발행 코드</td>
                <td>196,000DA85</td>
              </tr>
              <tr>
                <td className="text-muted">공모금</td>
                <td>9.8억원(980,000,000원)</td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col md={6}>
          <Table borderless>
            <tbody>
              <tr>
                <td className="text-muted">청약 시작</td>
                <td>24.12.01 월 15시</td>
              </tr>
              <tr>
                <td className="text-muted">청약 마감</td>
                <td>24.12.10 월 15시</td>
              </tr>
              <tr>
                <td className="text-muted">배정</td>
                <td>24.12.11(수)</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Building Information */}
      {/* <Nav className="mt-5 border-bottom">
        <Nav.Item>
          <Nav.Link className="border-bottom border-2 border-primary px-4">건물 정보</Nav.Link>
        </Nav.Item>
      </Nav> */}

    <div className="mt-5">
        <p className="common-title">건물 정보</p>
    <div className="common-line"></div>
    </div>

      <Row className="mt-4">
        <Col md={8}>
          <Row>
            <Col md={6}>
              <div className="mb-4">
                <h6 className="text-muted mb-2">연면적</h6>
                <p>16.83평 (55.65m2)</p>
              </div>
              <div className="mb-4">
                <h6 className="text-muted mb-2">용도 지역</h6>
                <p>제3종일반주거지역</p>
              </div>
              <div className="mb-4">
                <h6 className="text-muted mb-2">용도 지역</h6>
                <p>지상3층</p>
              </div>
              <div className="mb-4">
                <h6 className="text-muted mb-2">용도 지역</h6>
                <p>132.50%</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-4">
                <h6 className="text-muted mb-2">거래 대지면적</h6>
                <p>16.83평 (55.65m2)</p>
              </div>
              <div className="mb-4">
                <h6 className="text-muted mb-2">대지지분</h6>
                <p>16.83평 (55.65m2)</p>
              </div>
              <div className="mb-4">
                <h6 className="text-muted mb-2">건폐율</h6>
                <p>48.36%</p>
              </div>
            </Col>
          </Row>
        </Col>
        <Col md={4}>
          <div>
            <h6 className="mb-2">주소</h6>
            <p className="mb-3">서울 마포구 상암동 23-5</p>
            <Image
              src="/placeholder.svg?height=200&width=400"
              alt="Location map"
              className="w-100 rounded"
              style={{ height: '200px', objectFit: 'cover' }}
            />
          </div>
        </Col>
      </Row>

      {/* Market Price Information */}
      {/* <Nav className="mt-5 border-bottom">
        <Nav.Item>
          <Nav.Link className="border-bottom border-2 border-primary px-4">시세 정보</Nav.Link>
        </Nav.Item>
      </Nav> */}
    <div className="mt-5">
        <p className="common-title">시세 정보</p>
    <div className="common-line"></div>
    </div>

      <div className="mt-4">
        <Table hover>
          <thead>
            <tr>
              <th>날짜</th>
              <th>종가</th>
              <th>변동폭</th>
              <th>거래대금</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-light">
              <td>24.11.15</td>
              <td>3790</td>
              <td><span className="text-primary">▼ 3790</span></td>
              <td>904,650</td>
            </tr>
            <tr>
              <td>24.11.14</td>
              <td>3790</td>
              <td><span className="text-danger">▲ 70</span></td>
              <td>904,650</td>
            </tr>
            <tr className="bg-light">
              <td>24.11.13</td>
              <td>3790</td>
              <td><span className="text-danger">▲ 70</span></td>
              <td>904,650</td>
            </tr>
            <tr>
              <td>24.11.12</td>
              <td>3790</td>
              <td><span className="text-danger">▲ 70</span></td>
              <td>904,650</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  )
}