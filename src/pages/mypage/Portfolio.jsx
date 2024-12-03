import React from 'react';
import { Card } from 'react-bootstrap';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useOwnershipContext } from './OwnershipContext';

export default function Portfolio() {
  const { ownerships, colors } = useOwnershipContext();

  // 파이차트 데이터 준비
  const totalQuantity = ownerships.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const pieData = ownerships.map((item) => ({
    name: `${item.building_name} - ${item.detail_floor}층`,
    value: item.quantity,
    percentage: ((item.quantity / totalQuantity) * 100).toFixed(1),
  }));

  return (
    <Card className="shadow-sm bg-light border-light">
      <Card.Body>
        <Card.Title className="text-primary">포트폴리오</Card.Title>
        <Card className="shadow-sm bg-white border-light p-3">
          <div
            style={{
              width: '100%',
              height: 300,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '30px', // 차트와 텍스트 간격 조정
            }}
          >
            <div style={{ flex: 1.5, height: '100%' }}>
              {' '}
              {/* 차트 영역 비율 */}
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {/* 랜덤 색상 적용 */}
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 2 }}>
              {' '}
              {/* 텍스트 영역 비율 */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {pieData.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: colors[index % colors.length],
                          display: 'inline-block',
                          borderRadius: '50%',
                          marginRight: '10px',
                        }}
                      ></span>
                      {item.name}
                    </span>
                    <span>{item.percentage}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </Card.Body>
    </Card>
  );
}
