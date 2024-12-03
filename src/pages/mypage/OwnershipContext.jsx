import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Context 생성
const OwnershipContext = createContext();

// Context Provider 컴포넌트
export const OwnershipProvider = ({ children }) => {
  const [ownerships, setOwnerships] = useState([]);
  const [balance, setBalance] = useState(null);
  const [colors, setColors] = useState([]);

  // 랜덤 색상 생성 함수
  const generateRandomColors = (count) => {
    const predefinedColors = [
      '#3498DB',
      '#2ECC71',
      '#9B59B6',
      '#F1C40F',
      '#E74C3C',
      '#1ABC9C',
      '#E67E22',
      '#BDC3C7',
      '#34495E',
      '#7F8C8D',
    ];
    return Array.from(
      { length: count },
      (_, i) => predefinedColors[i % predefinedColors.length]
    );
  };

  useEffect(() => {
    const fetchOwnerships = async () => {
      try {
        const response = await axios.get('/api/ownerships', {
          withCredentials: true,
        });
        const fetchedOwnerships = response.data.ownerships;

        const ownershipsWithDetails = fetchedOwnerships.map((token) => ({
          ...token,
          detail_floor: token.detail_floor,
          building_name: token.building_name,
        }));

        // 총 매수 금액 계산
        const totalBuy = ownershipsWithDetails.reduce(
          (sum, token) => sum + token.quantity * (token.buy_price || 0),
          0
        );

        // 총 평가 금액 계산
        const totalEval = ownershipsWithDetails.reduce(
          (sum, token) => sum + token.quantity * (token.latest_price || 0),
          0
        );

        // 총 평가 손익 계산
        const profitLoss = totalEval - totalBuy;

        // 수익률 계산
        const profitRate =
          totalBuy > 0 ? ((profitLoss / totalBuy) * 100).toFixed(2) : 0;

        // 상태 업데이트
        setOwnerships(ownershipsWithDetails);
        setBalance((prev) => ({
          ...prev,
          total_buy: totalBuy,
          total_eval: totalEval,
          profit_loss: profitLoss,
          profit_rate: profitRate,
        }));
        setColors(generateRandomColors(ownershipsWithDetails.length));
      } catch (error) {
        console.error('보유 종목 가져오기 오류', error);
      }
    };

    const fetchBalance = async () => {
      try {
        const response = await axios.get('/api/users/buy-order-balance', {
          withCredentials: true,
        });
        setBalance(response.data);
      } catch (error) {
        console.error('사용자 지갑 정보 가져오기 오류:', error);
      }
    };

    fetchOwnerships();
    fetchBalance();
  }, []);

  return (
    <OwnershipContext.Provider value={{ ownerships, balance, colors }}>
      {children}
    </OwnershipContext.Provider>
  );
};

export const useOwnershipContext = () => useContext(OwnershipContext);
