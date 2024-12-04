import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export const TradeContext = createContext(null);

export const useTradeContext = () => {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error(
      'TradeProvider가 없는 곳에서 useTradeContext를 참조했습니다.'
    );
  }
  return context;
};

// TradeProvider 컴포넌트
export const TradeProvider = ({ children, id }) => {
  const [data, setData] = useState([]); // 차트 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/properties/${id}/history`);
        const history = response.data.history;

        // 날짜를 기준으로 데이터를 정렬
        const sortedHistory = history.sort(
          (a, b) => new Date(a.recorded_date) - new Date(b.recorded_date)
        );

        // 필요한 필드만 포함한 데이터로 변환
        const combinedData = sortedHistory.map((item) => ({
          date: item.recorded_date,
          time: new Date(item.recorded_date).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          }), // 시간 정보만 추출
          price: item.price,
          volume: item.quantity,
        }));

        setData(combinedData);
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <TradeContext.Provider value={{ id, data, loading, error }}>
      {children}
    </TradeContext.Provider>
  );
};
