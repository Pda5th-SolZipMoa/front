import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useTradeContext } from './TradeContext';

export default function TradeOrderForm({ type }) {
  const { id: propertyId, data } = useTradeContext(); // 건물Id를 Context에서 가져옴
  const [price, setPrice] = useState(''); // 주문 가격 상태
  const [quantity, setQuantity] = useState(''); // 주문 수량 상태
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태
  const [modalMessage, setModalMessage] = useState(''); // 모달에 표시할 메시지 상태
  const [totalBalance, setTotalBalance] = useState(0); // 보유 금액 상태
  const [orderableBalance, setOrderableBalance] = useState(0); // 주문 가능 금액 상태
  const [tradeableTokens, setTradeableTokens] = useState(0); // 거래 가능 토큰 상태
  const [quantityTokens, setQuantityTokens] = useState(0); // 보유 토큰 수량

  const [priceError, setPriceError] = useState(false); // 가격 입력 오류 상태
  const [quantityError, setQuantityError] = useState(false); // 수량 입력 오류 상태

  // 최신 가격을 초기값으로 설정
  useEffect(() => {
    if (data.length > 0) {
      const latestPrice = data[data.length - 1].price; // 최신 가격 가져오기
      setPrice(latestPrice);
    }
  }, [data]);

  // 주문 가능 금액 및 거래 가능 토큰 API 호출
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (type === 'buy') {
          // 매수 시 주문 가능 금액 가져오기
          const response = await axios.get('/api/users/buy-order-balance', {
            withCredentials: true, // JWT 토큰 사용
          });
          setOrderableBalance(response.data.orderable_balance);
          setTotalBalance(response.data.total_balance);
        } else {
          // 매도 시 거래 가능 토큰 가져오기
          const response = await axios.get(
            `/api/users/sell-order-balance/${propertyId}`,
            { withCredentials: true } // JWT 토큰 사용
          );
          setTradeableTokens(response.data.tradeable_tokens);
          setQuantityTokens(response.data.quantity);
        }
      } catch (err) {
        console.error(
          '데이터 가져오기 실패:',
          err.response?.data?.detail || err.message
        );
      }
    };

    fetchData();
  }, [type, propertyId]);

  // 모달 닫기 핸들러
  const handleClose = () => setShowModal(false);

  // 폼 제출 핸들러 (매수/매도 API 요청)
  const handleSubmit = async (event) => {
    event.preventDefault(); // 폼 기본 동작 방지

    // 유효성 검사
    const isPriceValid = price && price % 1000 === 0; // 가격이 입력되었는지, 1,000원 단위인지 확인
    const isQuantityValid = quantity && quantity > 0; // 수량이 입력되었는지, 양수인지 확인

    if (!isPriceValid || !isQuantityValid) {
      setPriceError(!isPriceValid);
      setQuantityError(!isQuantityValid);
      setModalMessage(
        `주문에 실패했습니다. ${
          !isPriceValid ? '가격은 1,000원 단위로 입력해주세요.' : ''
        } ${!isQuantityValid ? '수량은 1 이상이어야 합니다.' : ''}`.trim()
      );
      setShowModal(true);
      return;
    }

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
          <Form.Control
            type="number"
            value={price}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10) || '';
              setPrice(value);
              if (value % 1000 === 0) setPriceError(false); // 1,000원 단위면 에러 해제
            }}
            onBlur={(e) => {
              // 입력 종료 시 자동 보정
              const value = parseInt(e.target.value, 10) || 0;
              if (value % 1000 !== 0) {
                setPrice(Math.round(value / 1000) * 1000); // 1,000 단위로 보정
              }
            }}
            className={priceError ? 'is-invalid' : ''}
          />
          {priceError && (
            <Form.Text className="text-danger">
              가격은 1,000원 단위로 입력해주세요.
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>주문수량</Form.Label>
          <Form.Control
            type="number"
            placeholder="0"
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10) || '';
              setQuantity(value);
              if (value > 0) setQuantityError(false); // 양수면 에러 해제
            }}
            className={quantityError ? 'is-invalid' : ''}
          />
          {quantityError && (
            <Form.Text className="text-danger">
              수량은 1개 이상이어야 합니다.
            </Form.Text>
          )}
        </Form.Group>
        {/* 사용자 잔액 및 이용 가능량 표시 */}
        <div className="d-flex justify-content-between mb-3">
          <span>{type === 'buy' ? '원화잔액' : '토큰잔액'}</span>
          <span>
            {type === 'buy' ? `${totalBalance} 원` : `${quantityTokens} 개`}
          </span>
        </div>
        <div className="d-flex justify-content-between mb-3">
          <span>이용가능</span>
          <span>
            {type === 'buy'
              ? `${orderableBalance} 원`
              : `${tradeableTokens} 개`}
          </span>
        </div>
        {/* 매수/매도 버튼 */}
        <Button
          type="submit"
          variant={type === 'buy' ? 'danger' : 'primary'}
          className="w-100"
        >
          {type === 'buy' ? '매수하기' : '매도하기'}
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
