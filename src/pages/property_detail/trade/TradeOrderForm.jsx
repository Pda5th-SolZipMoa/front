import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useTradeContext } from './TradeContext';

export default function TradeOrderForm({ type }) {
  const { id: propertyId } = useTradeContext(); // 건물Id를 Context에서 가져옴
  const [price, setPrice] = useState(''); // 주문 가격 상태
  const [quantity, setQuantity] = useState(''); // 주문 수량 상태
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태
  const [modalMessage, setModalMessage] = useState(''); // 모달에 표시할 메시지 상태

  // 버튼 스타일 및 텍스트를 매수/매도에 따라 동적으로 설정
  const buttonColor = type === 'buy' ? 'danger' : 'primary';
  const buttonText = type === 'buy' ? '매수하기' : '매도하기';

  // 모달 닫기 핸들러
  const handleClose = () => setShowModal(false);

  // 폼 제출 핸들러 (매수/매도 API 요청)
  const handleSubmit = async (event) => {
    event.preventDefault(); // 폼 기본 동작 방지

    try {
      // API 엔드포인트와 요청 데이터 설정
      const endpoint = `/api/orders/${propertyId}/${type}`;
      const payload = {
        price_per_token: parseInt(price, 10),
        quantity: parseInt(quantity, 10),
      };

      // 주문 API 요청
      const response = await axios.post(endpoint, payload);

      // 성공 시 모달에 메시지 표시
      setModalMessage(response.data.message);
      setShowModal(true);
    } catch (err) {
      // 실패 시 오류 메시지 모달에 표시
      const errorMessage =
        err.response?.data?.detail || '주문 처리 중 오류가 발생했습니다.';
      setModalMessage(errorMessage);
      setShowModal(true);
    }
  };

  return (
    <>
      {/* 매수/매도 주문 입력 폼 */}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>주문가격</Form.Label>
          {/* 주문 가격 입력 필드 */}
          <Form.Control
            type="number"
            placeholder="53500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>주문수량</Form.Label>
          {/* 주문 수량 입력 필드 */}
          <Form.Control
            type="number"
            placeholder="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </Form.Group>
        {/* 사용자 잔액 및 이용 가능량 표시 */}
        <div className="d-flex justify-content-between mb-3">
          <span>{type === 'buy' ? '원화잔액' : '토큰잔액'}</span>
          <span>0 {type === 'buy' ? '원' : '개'}</span>
        </div>
        <div className="d-flex justify-content-between mb-3">
          <span>이용가능</span>
          <span>0 {type === 'buy' ? '원' : '개'}</span>
        </div>
        {/* 매수/매도 버튼 */}
        <Button type="submit" variant={buttonColor} className="w-100">
          {buttonText}
        </Button>
      </Form>

      {/* 주문 결과 모달 */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {type === 'buy' ? '매수 결과' : '매도 결과'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body> {/* 결과 메시지 표시 */}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
