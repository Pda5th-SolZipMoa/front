// DetailCategory.jsx
import './info.css'
import { Row, Col, Table, Image } from 'react-bootstrap'

export default function DetailCategory({ buildingData }) {
  if (!buildingData) {
    return <div>로딩 중...</div>
  }

  const buildingInfo = buildingData['건물정보']
  const latestTransactions = buildingData['최신거래']

  // 건물 정보 추출
  const platArea = buildingInfo['대지면적']
  const bcRat = buildingInfo['건폐율']
  const totArea = buildingInfo['연면적']
  const vlRat = buildingInfo['용적률']
  const buildAddress = buildingInfo['주소']
  return (
    <>
      {/* 토큰 발행정보 */}
      <div className="mt-5">
        <p className="common-title">토큰 발행정보</p>
        <div className="common-line"></div>
      </div>

      <Row className="mt-4">
        {/* 여기에 토큰 발행정보를 채워주세요 */}
      </Row>

      {/* 건물 정보 */}
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
                <p>{totArea} m²</p>
              </div>
              <div className="mb-4">
                <h6 className="text-muted mb-2">용적률</h6>
                <p>{vlRat}%</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-4">
                <h6 className="text-muted mb-2">대지면적</h6>
                <p>{platArea} m²</p>
              </div>
              <div className="mb-4">
                <h6 className="text-muted mb-2">건폐율</h6>
                <p>{bcRat}%</p>
              </div>
            </Col>
          </Row>
        </Col>
        <Col md={4}>
          <div>
            <h6 className="mb-2">주소</h6>
            <p className="mb-3">{buildAddress}</p>
            <Image
              src="/placeholder.svg?height=200&width=400"
              alt="Location map"
              className="w-100 rounded"
              style={{ height: '200px', objectFit: 'cover' }}
            />
          </div>
        </Col>
      </Row>

      {/* 시세 정보 */}
      <div className="mt-5">
        <p className="common-title">시세 정보</p>
        <div className="common-line"></div>
      </div>

      <div className="mt-4">
        <Table hover>
          <thead>
            <tr>
              <th>계약일자</th>
              <th>거래금액</th>
              <th>전용면적</th>
              <th>층</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(latestTransactions) ? (
              latestTransactions.map((transaction, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-light' : ''}>
                  <td>
                    {transaction['계약연도']}.{transaction['계약월']}.{transaction['계약일']}
                  </td>
                  <td>{transaction['거래금액']} 억원</td>
                  <td>{transaction['전용면적']} m²</td>
                  <td>{transaction['층']} 층</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">최근 거래 내역이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  )
}
