import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

export default function Signup() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: name,
      phone: phoneNumber,
    };

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/signup', 
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
        navigate('/')

      } else {
        alert(`오류 발생: ${response.statusText}`);
        console.error('Error:', response);
      }
    } catch (error) {
      console.error('서버 통신 에러:', error);
      alert('서버와의 통신에 문제가 발생했습니다.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
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
                placeholder="홍길동"
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
                color: 'white'
              }}
            >
              회원가입
            </button>
          </form>
          
          <div className="text-center">
            <span className="text-muted">이미 계정이 있으신가요?    </span>
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