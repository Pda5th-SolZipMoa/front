import React, { useState, useEffect } from 'react';
import { Button, Form, ProgressBar, Modal } from 'react-bootstrap';
import { ethers } from 'ethers';
import myToken from '../../../hooks/myToken.json';

const contractAddress = import.meta.env.VITE_APP_CONTRACT_ADDRESS;

export default function DetailBox({ buildingData, selectedDetail }) {
  const [subscriptionAmount, setSubscriptionAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenDetails, setTokenDetails] = useState(null);
  const [remainingTokens, setRemainingTokens] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [ethCost, setEthCost] = useState(0);
  const [krwCost, setKrwCost] = useState(0);

  const pricePerTokenKRW = 1000000; // 토큰 당 가격 더미 데이터
  const ethToKrwRate = 5100000; // 1 ETH = 510만원
  const pricePerTokenETH = pricePerTokenKRW / ethToKrwRate; // 1 토큰당 가격 (ETH 단위)

  const pricePerTokenETHInWei = ethers.parseUnits(
    pricePerTokenETH.toString(),
    'ether'
  );

  const buildingInfo = buildingData?.['건물정보'];
  const buildingCode = buildingInfo?.['빌딩코드'] || '데이터 없음';
  const floor = selectedDetail?.['층수'];
  const building_token_id = `${buildingCode}_${floor}`;

  useEffect(() => {
    if (building_token_id) {
      handleGetTokenDetails();
    }
  }, [building_token_id]);

  const handleGetTokenDetails = async () => {
    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        myToken.abi,
        signer
      );

      const [exists, property] = await contract.getTokenDetails(
        building_token_id
      );

      if (exists) {
        setTokenDetails({
          tokenId: property.tokenId,
          totalSupply: property.totalSupply.toString(),
          remainingTokens: property.remainingTokens.toString(),
        });
        setRemainingTokens(property.remainingTokens.toString());
      } else {
        setTokenDetails(null);
      }
    } catch (error) {
      console.error('토큰 조회 중 오류:', error);
      setTokenDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribe = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask가 설치되어 있지 않습니다.');
      }

      if (!subscriptionAmount || subscriptionAmount <= 0) {
        alert('올바른 청약 수량을 입력하세요.');
        return;
      }

      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        myToken.abi,
        signer
      );

      const totalCostETH = subscriptionAmount * pricePerTokenETH;
      const totalCostInWei = ethers.parseUnits(
        totalCostETH.toString(),
        'ether'
      );
      const totalCostInKRW = totalCostETH * ethToKrwRate;

      setEthCost(totalCostETH);
      setKrwCost(totalCostInKRW);

      setShowModal(true);

      // 트랜잭션 실행
      const tx = await contract.subscribe(
        building_token_id,
        parseInt(subscriptionAmount, 10),
        pricePerTokenETHInWei,
        {
          value: totalCostInWei,
          gasLimit: 500000,
        }
      );

      await tx.wait(); // 트랜잭션 완료까지 기다림

      alert('청약 신청이 성공적으로 완료되었습니다!');
      setShowModal(false); // 트랜잭션 완료 후 팝업 닫기
    } catch (error) {
      console.error('청약 신청 중 오류:', error);
      alert('청약 신청 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /* 청약 마감 함수 

  const closeSubscription = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask가 설치되어 있지 않습니다.');
      }

      setIsLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        myToken.abi,
        signer
      );

      const tx = await contract.closeSubscription(building_token_id);
      await tx.wait();

      alert('청약이 성공적으로 마감되었습니다!');
    } catch (error) {
      console.error('청약 마감 중 오류:', error);
      alert('청약 마감 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  */

  // Close modal
  const handleCloseModal = () => setShowModal(false);

  if (!buildingData || !selectedDetail) {
    return <div>로딩 중...</div>;
  }

  // 건물명
  const buildingName = buildingData['건물정보']['건물명'] || '건물명 없음';

  // 제목 생성
  const title = `${buildingName} - ${selectedDetail['집 평수']}평/${selectedDetail['층수']}층`;


  // 필요한 데이터 추출
  const tokenSupply = selectedDetail['토큰발행'] || 0;
  const tokenCost = selectedDetail['토큰가격'] || 0;
  const publicOfferingAmount = (tokenSupply * tokenCost) || '데이터 없음';
  const subscriptionPeriod = selectedDetail['청약기간'] || '데이터 없음';
  const remainingPrice = buildingData['건물정보']['잔여가'] || '데이터 없음'; // 필요에 따라 수정

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h5 className="mb-3">{buildingInfo?.['건물명'] || '건물명 없음'}</h5>
      <div className="bg-success-subtle p-2 rounded mb-3">
        <small className="text-success">신한투자증권이 발행함.</small>
      </div>
      <div className="mb-3">
        <div className="mb-3">
          <ProgressBar
            now={(remainingTokens / tokenDetails?.totalSupply) * 100}
            label={`${remainingTokens}/${tokenDetails?.totalSupply} 남음`}
            className="custom-progress-bar"
          />
        </div>

        <style jsx>{`
          .custom-progress-bar .progress-bar {
            background-color: #cc8eff; /* 보라색 배경 설정 */
          }
        `}</style>
      </div>
      <Form.Control
        type="number"
        placeholder="청약 수량 입력"
        value={subscriptionAmount}
        onChange={(e) => setSubscriptionAmount(e.target.value)}
        className="mb-3"
      />
      <Button
        className="w-100 mb-3"
        style={{ backgroundColor: '#6f41c1', borderColor: '#6f41c1' }}
        onClick={subscribe}
        disabled={isLoading}
      >
        {isLoading ? '청약 신청 중...' : '청약하기'}
      </Button>
      {/*
      <Button
        className="w-100 mb-3"
        style={{ backgroundColor: '#DC3545', borderColor: '#DC3545' }}
        disabled={isLoading}
      >
        {isLoading ? '청약 마감 중...' : '청약 마감하기'}
      </Button>
  */}
      <div className="mb-3">
        {tokenDetails ? <ul></ul> : <p>보유한 토큰이 없습니다.</p>}
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            청약 신청 시, 다음과 같은 금액이 이더리움으로 차감됩니다.
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>이더리움 (ETH):</strong> {ethCost} ETH
          </p>
          <p>
            <strong>원화 (KRW):</strong> {krwCost.toLocaleString()} 원
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .custom-modal .modal-content {
          background-color: #f3f0ff; /* Light purple background */
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .custom-modal .modal-header {
          background-color: #6f42c1; /* Purple header */
          color: white;
          border-bottom: 2px solid #5a32a3; /* Darker purple bottom border */
          border-radius: 15px 15px 0 0;
        }

        .custom-modal .modal-header .modal-title {
          font-size: 1rem;
          font-weight: 600;
        }

        .custom-modal .modal-body {
          padding: 20px 10px;
          font-size: 1rem;
        }

        .custom-modal .modal-body p {
          margin: 10px 0;
          font-size: 1rem;
          font-weight: 500;
          color: #4b0082; /* Dark purple text */
        }

        .custom-modal .modal-footer {
          display: flex;
          justify-content: center;
          padding-top: 15px;
        }

        .custom-modal .modal-footer button {
          background-color: #9b59b6; /* Purple button */
          color: white;
          font-weight: 500;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }

        .custom-modal .modal-footer button:hover {
          background-color: #8e44ad; /* Darker purple on hover */
        }

        /* Adding animation */
        .custom-modal .modal-content {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
