import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import TradeOptionsBox from './TradeOptionsBox';
import TradeOrderForm from './TradeOrderForm';

export default function TradeBoard() {
  const [key, setKey] = useState('buy');

  return (
    <div className="border rounded p-3 bg-white">
      <Tabs
        id="trade-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="buy" title="매수">
          <TradeOptionsBox type="buy" />
          <TradeOrderForm type="buy" />
        </Tab>
        <Tab eventKey="sell" title="매도">
          <TradeOptionsBox type="sell" />
          <TradeOrderForm type="sell" />
        </Tab>
      </Tabs>
    </div>
  );
}
