import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await browserProvider.send('eth_requestAccounts', []);
        const signer = await browserProvider.getSigner();

        const address = await signer.getAddress();
        setAccount(address);
        setProvider(browserProvider);

        console.log('Connected account:', address);
      } else {
        alert('메타마스크가 설치되어 있지 않습니다.');
      }
    } catch (error) {
      console.error('메타마스크 연결 실패:', error);
      alert('지갑 연결 중 문제가 발생했습니다.');
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await browserProvider.listAccounts();
          if (accounts.length > 0) {
            const signer = await browserProvider.getSigner();
            const address = await signer.getAddress();
            setAccount(address);
            setProvider(browserProvider);

            console.log('Previously connected account:', address);
          }
        } catch (error) {
          console.error('자동 연결 확인 중 오류:', error);
        }
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length > 0) {
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          const signer = await browserProvider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);
          setProvider(browserProvider);

          console.log('Account changed to:', address);
        } else {
          setAccount(null);
          setProvider(null);
          console.log('Account disconnected');
        }
      });
    }
  }, []);

  return { account, connectWallet, provider };
};

export default useWallet;
