import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // navigate 기능 추가

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

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
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-sm" style={{ width: '400px' }}>
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
                placeholder="01012345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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
