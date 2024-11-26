import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Button } from 'react-bootstrap';

export default function TradeGraph() {
  const [activeTab, setActiveTab] = useState('1개월');

  const data = [
    { date: '10월 24일', price: 58000 },
    { date: '10월 26일', price: 57000 },
    { date: '10월 28일', price: 58500 },
    { date: '10월 30일', price: 56000 },
    { date: '11월 4일', price: 59000 },
    { date: '11월 8일', price: 57500 },
    { date: '11월 14일', price: 50500 },
    { date: '11월 20일', price: 55500 },
  ];

  const timeFrames = ['1시간', '1일'];

  return (
    <div className="border rounded p-3 bg-white h-100">
      <div className="d-flex justify-content-between mb-2">
        <div className="d-flex gap-2">
          {timeFrames.map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'primary' : 'light'}
              className={`rounded-pill px-3 py-1 ${
                activeTab === tab ? 'text-white' : 'text-secondary'
              }`}
              onClick={() => setActiveTab(tab)}
              style={{
                backgroundColor: activeTab === tab ? '#8e44ad' : 'transparent',
                border: 'none',
                fontSize: '0.9rem',
              }}
            >
              {tab}
            </Button>
          ))}
        </div>
        <span className="text-danger">-4.31%</span>
      </div>

      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8e44ad" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#8e44ad" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: '0.8rem' }}
            />
            <YAxis
              domain={['dataMin - 1000', 'dataMax + 1000']}
              axisLine={false}
              tickLine={false}
              style={{ fontSize: '0.8rem' }}
              tickFormatter={(value) => `${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                padding: '8px',
              }}
              formatter={(value) => [`${value.toLocaleString()}원`]}
              labelStyle={{ color: '#666' }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#8e44ad"
              strokeWidth={2}
              dot={{ r: 3, fill: '#8e44ad' }}
              activeDot={{ r: 5 }}
              fill="url(#colorPrice)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
