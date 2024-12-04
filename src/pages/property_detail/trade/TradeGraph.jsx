import React from 'react';
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
import { useTradeContext } from './TradeContext';

export default function TradeGraph() {
  const { data, loading, error } = useTradeContext(); // 데이터 가져오기

  if (loading) {
    return <div>데이터 로딩 중...</div>;
  }

  if (error) {
    return <div>오류가 발생했습니다: {error}</div>;
  }

  return (
    <div className="border rounded p-3 bg-white h-100">
      {/* 가격을 표시하는 라인 차트 */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          syncId="chart"
          margin={{ top: 5, right: 30, left: 20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={false}
            label={false}
          />
          <YAxis
            yAxisId="left"
            domain={['dataMin - 1000', 'dataMax + 1000']}
            axisLine={false}
            tickLine={false}
            style={{ fontSize: '0.8rem' }}
            tickFormatter={(value) => `${value.toLocaleString()}`}
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
              return null;
            }}
          />
          <Line
            yAxisId="left"
            type="linear"
            dataKey="price"
            name="가격"
            stroke="#DF0101"
            strokeWidth={2}
            dot={false}
            activeDot={false}
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
          syncId="chart"
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
            tickFormatter={(value) => `${value.toLocaleString()}개`}
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
