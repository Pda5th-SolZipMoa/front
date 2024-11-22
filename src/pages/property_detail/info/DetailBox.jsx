import { Button } from 'react-bootstrap'
import { ChevronDown } from 'lucide-react'

export default function DetailBox() {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h5 className="mb-3">북촌월하재</h5>
      <div className="bg-success-subtle p-2 rounded mb-3">
        <small className="text-success">~ 한 좌대 6% 배당률 여상</small>
      </div>
      <div className="mb-3">
        <div className="d-flex justify-content-between mb-2">
          <span>공모금액</span>
          <span className="fw-bold">9.8억원</span>
        </div>
        <div className="d-flex justify-content-between">
          <span>청약기간</span>
          <span>24.11.27 - 24.12.10</span>
        </div>
      </div>
      <Button className="w-100 mb-3" style={{ backgroundColor: '#6B21A8', borderColor: '#6B21A8' }}>
        청약하기
      </Button>
      <div className="d-flex justify-content-between align-items-center">
        <span>잔여가</span>
        <div>
          <span className="text-primary me-2">3,790원</span>
          <ChevronDown className="text-muted" />
        </div>
      </div>
    </div>
  )
}