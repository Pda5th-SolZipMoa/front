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
                  <td>{transaction['거래금액']} 만원</td>
                  <td>{transaction['전용면적']} m²</td>
                  <td>{transaction['층']}</td>
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



// import './info.css'
// import { Nav, Row, Col, Table, Image } from 'react-bootstrap'

// export default function DetailCategory() {
//   return (
//     <>
//     <div className="mt-5">
//     <p className="common-title">토큰 발행정보</p>
//     <div className="common-line"></div>
//     </div>

//       <Row className="mt-4">
//         <Col md={6}>
//           <Table borderless>
//             <tbody>
//               <tr>
//                 <td className="text-muted">청약 기간</td>
//                 <td>2024.11.27-2024.12.10</td>
//               </tr>
//               <tr>
//                 <td className="text-muted">발행 코드</td>
//                 <td>196,000DA85</td>
//               </tr>
//               <tr>
//                 <td className="text-muted">공모금</td>
//                 <td>9.8억원(980,000,000원)</td>
//               </tr>
//             </tbody>
//           </Table>
//         </Col>
//         <Col md={6}>
//           <Table borderless>
//             <tbody>
//               <tr>
//                 <td className="text-muted">청약 시작</td>
//                 <td>24.12.01 월 15시</td>
//               </tr>
//               <tr>
//                 <td className="text-muted">청약 마감</td>
//                 <td>24.12.10 월 15시</td>
//               </tr>
//               <tr>
//                 <td className="text-muted">배정</td>
//                 <td>24.12.11(수)</td>
//               </tr>
//             </tbody>
//           </Table>
//         </Col>
//       </Row>

//       {/* Building Information */}
//       {/* <Nav className="mt-5 border-bottom">
//         <Nav.Item>
//           <Nav.Link className="border-bottom border-2 border-primary px-4">건물 정보</Nav.Link>
//         </Nav.Item>
//       </Nav> */}

//     <div className="mt-5">
//         <p className="common-title">건물 정보</p>
//     <div className="common-line"></div>
//     </div>

//       <Row className="mt-4">
//         <Col md={8}>
//           <Row>
//             <Col md={6}>
//               <div className="mb-4">
//                 <h6 className="text-muted mb-2">연면적</h6>
//                 <p>16.83평 (55.65m2)</p>
//               </div>
//               <div className="mb-4">
//                 <h6 className="text-muted mb-2">용도 지역</h6>
//                 <p>제3종일반주거지역</p>
//               </div>
//               <div className="mb-4">
//                 <h6 className="text-muted mb-2">용도 지역</h6>
//                 <p>지상3층</p>
//               </div>
//               <div className="mb-4">
//                 <h6 className="text-muted mb-2">용도 지역</h6>
//                 <p>132.50%</p>
//               </div>
//             </Col>
//             <Col md={6}>
//               <div className="mb-4">
//                 <h6 className="text-muted mb-2">거래 대지면적</h6>
//                 <p>16.83평 (55.65m2)</p>
//               </div>
//               <div className="mb-4">
//                 <h6 className="text-muted mb-2">대지지분</h6>
//                 <p>16.83평 (55.65m2)</p>
//               </div>
//               <div className="mb-4">
//                 <h6 className="text-muted mb-2">건폐율</h6>
//                 <p>48.36%</p>
//               </div>
//             </Col>
//           </Row>
//         </Col>
//         <Col md={4}>
//           <div>
//             <h6 className="mb-2">주소</h6>
//             <p className="mb-3">서울 마포구 상암동 23-5</p>
//             <Image
//               src="/placeholder.svg?height=200&width=400"
//               alt="Location map"
//               className="w-100 rounded"
//               style={{ height: '200px', objectFit: 'cover' }}
//             />
//           </div>
//         </Col>
//       </Row>

//       {/* Market Price Information */}
//       {/* <Nav className="mt-5 border-bottom">
//         <Nav.Item>
//           <Nav.Link className="border-bottom border-2 border-primary px-4">시세 정보</Nav.Link>
//         </Nav.Item>
//       </Nav> */}
//     <div className="mt-5">
//         <p className="common-title">시세 정보</p>
//     <div className="common-line"></div>
//     </div>

//       <div className="mt-4">
//         <Table hover>
//           <thead>
//             <tr>
//               <th>날짜</th>
//               <th>종가</th>
//               <th>변동폭</th>
//               <th>거래대금</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr className="bg-light">
//               <td>24.11.15</td>
//               <td>3790</td>
//               <td><span className="text-primary">▼ 3790</span></td>
//               <td>904,650</td>
//             </tr>
//             <tr>
//               <td>24.11.14</td>
//               <td>3790</td>
//               <td><span className="text-danger">▲ 70</span></td>
//               <td>904,650</td>
//             </tr>
//             <tr className="bg-light">
//               <td>24.11.13</td>
//               <td>3790</td>
//               <td><span className="text-danger">▲ 70</span></td>
//               <td>904,650</td>
//             </tr>
//             <tr>
//               <td>24.11.12</td>
//               <td>3790</td>
//               <td><span className="text-danger">▲ 70</span></td>
//               <td>904,650</td>
//             </tr>
//           </tbody>
//         </Table>
//       </div>
//     </>
//   )
// }