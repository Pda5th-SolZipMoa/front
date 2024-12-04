import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // navigate 기능 추가

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  // 전화번호 형식 변경 함수
  const formatPhoneNumber = (value) => {
    const onlyNumbers = value.replace(/[^0-9]/g, '');
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
    try {
      const response = await axios.post('/api/login', { phone: phoneNumber });

      if (response.status === 200 || response.status === 201) {
        console.log('Response:', response.data);
        navigate('/main'); // 로그인 성공 시 메인 페이지로 이동
      } else {
        alert('로그인 실패: 서버 오류');
        console.error('Error:', response);
      }
    } catch (error) {
      console.error('서버 통신 에러:', error);
      alert('회원가입 정보가 없는 전화번호 입니다.');
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
        margin: 0, // 여백 제거
        padding: 0, // 패딩 제거
        overflow: 'hidden', // 필요 시 스크롤 방지
        backgroundImage: 'url("/loginimage.jpg")', // 배경 이미지 설정
        backgroundSize: 'cover', // 배경 이미지 꽉 채우기
        backgroundPosition: 'center', // 이미지 중앙 정렬
        backgroundRepeat: 'no-repeat', // 반복 금지
      }}
    >
      <div className="card shadow-sm" style={{ width: '400px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <div className="card-body p-4">
          <h2 className="text-center mb-4">로그인</h2>
          <p className="text-muted text-center mb-4">전화번호로 로그인하세요</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">전화번호</label>
              <input
                type="tel"
                className="form-control"
                id="phoneNumber"
                placeholder="010-1234-5678"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                maxLength={13} // 최대 길이 제한
                required
              />
            </div>

            <button
              type="submit"
              className="btn w-100 mb-3"
              style={{
                backgroundColor: '#6f42c1',
                color: 'white',
              }}
            >
              로그인
            </button>
          </form>

          <div className="text-center">
            <span className="text-muted">계정이 없으신가요? </span>
            <a
              href="/signup"
              className="text-decoration-none"
              style={{ color: '#6f42c1' }}
            >
              회원가입
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
