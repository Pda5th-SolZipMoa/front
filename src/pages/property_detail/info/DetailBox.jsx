import React, { useState, useEffect } from 'react';
import { Button, Form, ProgressBar, Modal } from 'react-bootstrap';
import { ethers } from 'ethers';
import axios from 'axios';
import myToken from '../../../hooks/myToken.json';

const contractAddress = import.meta.env.VITE_APP_CONTRACT_ADDRESS;

export default function DetailBox({ buildingData, selectedDetail }) {
  const [subscriptionAmount, setSubscriptionAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalTokens] = useState(
    parseInt(selectedDetail?.['토큰발행'], 10) || 0
  );
  const [remainingTokens, setRemainingTokens] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [ethCost, setEthCost] = useState(0);
  const [krwCost, setKrwCost] = useState(0);

  console.log(selectedDetail);

  // 전체 청약 토큰 대비 남아 있는 토큰 수 계산
  useEffect(() => {
    const fetchRemainingTokens = async () => {
      console.log('실행');
      try {
        const response = await axios.get(
          `/api/subscriptions/tokens/${selectedDetail?.['id']}`
        );
        setRemainingTokens(totalTokens - response.data.total_quantity);
      } catch (error) {
        console.error('Error fetching remaining tokens:', error);
      }
    };

    fetchRemainingTokens();
  }, []);

  console.log(selectedDetail);
  const pricePerTokenKRW = parseInt(selectedDetail?.['토큰가격'], 10) * 10000;
  const ethToKrwRate = 5100000; // 1 ETH = 510만원
  const pricePerTokenETH = Math.floor(pricePerTokenKRW / ethToKrwRate);

  const subscriptionStart = selectedDetail?.['청약시작일'] || '2024-01-01';
  let subscriptionEnd = selectedDetail?.['청약종료일'] || '2024-01-10';

  subscriptionEnd = `${subscriptionEnd} 23:59`;

  const progress = ((remainingTokens / totalTokens) * 100).toFixed(2);

  const handleCloseModal = () => setShowModal(false);

  const subscribe = async () => {
    const amount = parseInt(subscriptionAmount, 10);

    if (!amount || amount <= 0) {
      alert('올바른 청약 수량을 입력하세요.');
      return;
    }

    if (amount > remainingTokens) {
      alert('남은 토큰 수량보다 많은 수량을 청약할 수 없습니다.');
      return;
    }

    const totalCostETH = amount * pricePerTokenETH;
    const totalCostInKRW = totalCostETH * ethToKrwRate;

    const totalCostInWei = ethers.parseUnits(totalCostETH.toString(), 'ether');

    setEthCost(totalCostETH);
    setKrwCost(totalCostInKRW);

    try {
      console.log('청약 요청 시작');

      // API 요청 보내기
      const response = await fetch('/api/subscriptions/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_detail_id: selectedDetail?.['id'],
          quantity: amount,
          tradeable_tokens: amount,
          buy_price: pricePerTokenKRW,
          subscription_end_date: subscriptionEnd,
        }),
      });

      console.log('백엔드 응답:', response);

      if (!response.ok) {
        throw new Error(
          `API 호출 실패: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log('백엔드 처리 결과:', result);

      alert('청약 신청이 성공적으로 완료되었습니다!');
      setRemainingTokens((prev) => prev - amount);
      setShowModal(true);
    } catch (error) {
      console.error('청약 신청 중 오류:', error);
      alert('청약 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const buildingName = buildingData?.['건물정보']?.['건물명'] || '건물명 없음';
  const title = `${buildingName} - ${selectedDetail?.['집 평수']}평/${selectedDetail?.['층수']}층`;

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4" style={{ backgroundColor: '#F8F7FF' }}>
        <h4 className="card-title text-center mb-3 fw-bold">{title}</h4>
        <p className="text-center text-muted small mb-4">
          청약 기간: {subscriptionStart} ~ {subscriptionEnd}
        </p>

        <ProgressBar
          now={progress}
          label={`${remainingTokens}/${totalTokens}`}
          className="mb-4"
          style={{
            height: '20px',
            borderRadius: '10px',
          }}
        >
          <ProgressBar
            now={progress}
            style={{
              backgroundColor: '#6c63ff',
              backgroundImage: 'linear-gradient(to right, #6c63ff, #9a8bff)',
            }}
          />
        </ProgressBar>

        <div
          className="mb-4 p-3 rounded-3 shadow-sm"
          style={{ backgroundColor: '#fff' }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted">토큰당 가격</span>
            <span className="fw-bold" style={{ color: '#7F3FFC' }}>
              {pricePerTokenKRW.toLocaleString()} 원
            </span>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted">총 발행된 토큰 개수</span>
            <span className="fw-bold" style={{ color: '#7F3FFC' }}>
              {totalTokens.toLocaleString()} 개
            </span>
          </div>
        </div>

        {/* 청약 입력 */}
        <Form.Control
          type="number"
          placeholder="청약 수량 입력"
          value={subscriptionAmount}
          onChange={(e) => setSubscriptionAmount(e.target.value)}
          className="mb-3 text-center fw-bold border-0 shadow-sm"
          style={{ backgroundColor: '#fff' }}
        />
        <Button
          className="w-100 py-2 fw-bold border-0 shadow-sm"
          onClick={subscribe}
          disabled={isLoading || remainingTokens <= 0}
          style={{ backgroundColor: '#7F3FFC', borderRadius: '8px' }}
        >
          {isLoading ? '청약 진행 중...' : '청약하기'}
        </Button>

        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton className="custom-modal-header">
            <Modal.Title className="fw-bold">청약 신청 완료</Modal.Title>
          </Modal.Header>
          <Modal.Body className="custom-modal-body">
            <p>
              <strong>청약 수량:</strong> {subscriptionAmount} 개
            </p>
            <p>
              <strong>이더리움 (ETH):</strong> {ethCost.toFixed(6)} ETH
            </p>
            <p>
              <strong>원화 (KRW):</strong> {krwCost.toLocaleString()} 원
            </p>
          </Modal.Body>
          <Modal.Footer className="custom-modal-footer">
            <Button
              variant="secondary"
              onClick={handleCloseModal}
              className="custom-button"
            >
              닫기
            </Button>
          </Modal.Footer>
        </Modal>

        <style jsx>{`
          .custom-modal .modal-content {
            background: linear-gradient(
              145deg,
              #e3dff5,
              #ffffff
            ); /* Gradient background */
            border-radius: 20px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2); /* Enhanced shadow */
            animation: scaleFadeIn 0.4s ease-out; /* Smooth animation */
          }

          .custom-modal-header {
            background-color: #845ef7; /* Soft purple */
            color: white;
            padding: 10px;
            font-size: 1.2rem;
            font-weight: bold;
            border-bottom: 2px solid #6c47d6;
          }

          .custom-modal-body {
            padding: 10px 10px;
            font-size: 1rem;
            color: #333;
          }

          .custom-modal-body p {
            margin: 12px 0;
            font-weight: 500;
            color: #4b0082; /* Dark purple */
          }

          .custom-modal-footer {
            display: flex;
            justify-content: center;
            padding: 7px;
          }

          .custom-button {
            background-color: #845ef7; /* Purple */
            color: white;
            font-weight: 600;
            padding: 10px 25px;
            border: none;
            border-radius: 8px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Button shadow */
          }

          .custom-button:hover {
            background-color: #6c47d6; /* Darker purple */
            transform: scale(1.05); /* Slightly enlarge */
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
          }

          /* Add smooth scale and fade animation */
          @keyframes scaleFadeIn {
            0% {
              opacity: 0;
              transform: scale(0.9);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
