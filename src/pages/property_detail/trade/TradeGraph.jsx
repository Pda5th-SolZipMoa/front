import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import { useTradeContext } from './TradeContext';

export default function TradeGraph() {
  const { id: propertyId } = useTradeContext(); // Context에서 건물 ID 가져오기
  const [data, setData] = useState([]); // 데이터를 저장할 상태

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/properties/${propertyId}/history`
        );
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

        setData(combinedData); // 정제된 데이터를 상태에 저장
      } catch (err) {
        console.error(
          '데이터 가져오기 실패:',
          err.response?.data?.detail || err.message
        );
      }
    };

    fetchData(); // 데이터 요청 함수 실행
  }, [propertyId]);

  return (
    <div className="border rounded p-3 bg-white h-100">
      {/* 가격을 표시하는 라인 차트 */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          syncId="chart" // 아래 바 차트와 X축 동기화
          margin={{ top: 5, right: 30, left: 20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />{' '}
          {/* 격자선 */}
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={false} // X축 숨기기
            label={false}
          />
          <YAxis
            yAxisId="left"
            domain={['dataMin - 1000', 'dataMax + 1000']} // Y축 범위 설정
            axisLine={false}
            tickLine={false}
            style={{ fontSize: '0.8rem' }}
            tickFormatter={(value) => `${value.toLocaleString()}`} // 숫자 형식 지정
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const { date, price, volume } = payload[0].payload;
                return (
                  <div
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      padding: '10px',
                    }}
                  >
                    {/* 툴팁에 날짜, 시간, 가격, 거래량 표시 */}
                    <p style={{ margin: 0 }}>
                      날짜: {new Date(date).toLocaleDateString('ko-KR')}
                    </p>
                    <p style={{ margin: 0 }}>
                      시간: {new Date(date).toLocaleTimeString('ko-KR')}
                    </p>
                    <p style={{ margin: 0 }}>
                      가격: {price.toLocaleString()}원
                    </p>
                    <p style={{ margin: 0 }}>
                      거래량: {volume.toLocaleString()}개
                    </p>
                  </div>
                );
              }
              return null; // 툴팁 숨김
            }}
          />
          <Line
            yAxisId="left"
            type="linear" // 선을 직선으로 설정
            dataKey="price"
            name="가격"
            stroke="#DF0101" // 선 색상(빨간색)
            strokeWidth={2}
            dot={false} // 데이터 점 제거
            activeDot={false} // 활성 데이터 점 제거
          />
        </LineChart>
      </ResponsiveContainer>

      {/* 차트 사이 구분선 */}
      <div
        style={{
          borderTop: '1px solid #ddd',
          margin: '0 20px',
          width: 'calc(100% - 40px)',
        }}
      ></div>

      {/* 거래량을 표시하는 바 차트 */}
      <ResponsiveContainer width="100%" height={150}>
        <BarChart
          data={data}
          syncId="chart" // 위 라인 차트와 X축 동기화
          margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            style={{ fontSize: '0.8rem' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            style={{ fontSize: '0.8rem' }}
            tickFormatter={(value) => `${value.toLocaleString()}개`} // 거래량 형식 지정
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const { date, volume } = payload[0].payload;
                return (
                  <div
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      padding: '10px',
                    }}
                  >
                    {/* 툴팁에 시간과 거래량 표시 */}
                    <p style={{ margin: 0 }}>
                      시간: {new Date(date).toLocaleTimeString('ko-KR')}
                    </p>
                    <p style={{ margin: 0 }}>
                      거래량: {volume.toLocaleString()}개
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="volume" name="거래량" fill="#5F04B4" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
