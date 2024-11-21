import React, { createContext, useContext } from 'react';

export const TradeContext = createContext(null);

export const useTradeContext = () => {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error('TradeProvider가 없는 곳에 useTradeContext를 참조');
  }
  return context;
};

export const TradeProvider = ({ children, id }) => {
  return (
    <TradeContext.Provider value={{ id }}>{children}</TradeContext.Provider>
  );
};
