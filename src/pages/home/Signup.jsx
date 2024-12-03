import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  // 전화번호 형식 변경 함수
  const formatPhoneNumber = (value) => {
    // 숫자만 추출
    const onlyNumbers = value.replace(/[^0-9]/g, '');
    
    // 형식 지정
    if (onlyNumbers.length <= 3) {
      return onlyNumbers;
    } else if (onlyNumbers.length <= 7) {
      return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3)}`;
    } else {
      return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3, 7)}-${onlyNumbers.slice(7, 11)}`;
    }
  };

  const handlePhoneNumberChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedPhone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: name,
      phone: phoneNumber,
    };

    try {
      const response = await axios.post(
        '/api/signup', 
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert('회원가입 성공!');
        console.log('Response:', response.data);
        navigate('/');
      } else {
        alert(`오류 발생: ${response.statusText}`);
        console.error('Error:', response);
      }
    } catch (error) {
      // 에러 처리
      if (error.response && error.response.status === 400) {
        // 백엔드에서 보낸 400 에러 처리
        alert('이미 계정 정보가 등록된 회원입니다.');
      } else {
        console.error('서버 통신 에러:', error);
        alert('서버와의 통신에 문제가 발생했습니다.');
      }
    }
  };

  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // 화면 전체 높이
        width: '100vw', // 화면 전체 너비
        background: 'linear-gradient(100deg, #F3EDFB 56.38%, #FAE7F7 98.45%)', // 배경 색상 지정
        margin: 0, // 여백 제거
        padding: 0, // 패딩 제거
        overflow: 'hidden', // 필요 시 스크롤 방지
      }}
    >
      <div className="card shadow-sm" style={{ width: '400px' }}>
        <div className="card-body p-4">
          <h2 className="text-center mb-4">회원가입</h2>
          <p className="text-muted text-center mb-4">SOL집모아에 오신 것을 환영합니다!</p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">이름</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="이름을 입력해주세요."
                value={name}
                onChange={(e) => setName(e.target.value)}
                pattern="^[가-힣]{3}$"
                title="이름은 한글 3글자 형식으로 입력해주세요."
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">전화번호</label>
              <input
                type="tel"
                className="form-control"
                id="phoneNumber"
                placeholder="010-1234-5678"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                maxLength={13} // 전화번호 최대 길이 제한
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn w-100 mb-3"
              style={{ 
                backgroundColor: '#6f42c1',
                color: 'white'
              }}
            >
              회원가입
            </button>
          </form>
          
          <div className="text-center">
            <span className="text-muted">이미 계정이 있으신가요? </span>
            <a 
              href="/" 
              className="text-decoration-none"
              style={{ color: '#6f42c1' }}
            >
              로그인
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
