import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import logo from "/side_detail_gpt.png";


function ChatGPT() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: { text: '안녕하세요. 저에게 투자정보를 문의하시면, 빠르고 신속하게 알려드릴게요.' }
    }
  ]);
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', content: { text: input } };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    setInput("");

    try {
      const response = await axios.post('http://localhost:8000/api/chat', {
        user_message: input
      });

      const botMessage = { type: 'bot', content: { text: response.data.bot_reply } };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("ChatGPT API 호출 오류:", error);
      const errorMessage = { type: 'bot', content: { text: '오류가 발생했습니다. 다시 시도해주세요.' } };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className="card mt-4">
      <div className="card-header">
        <h3 className="h5 mb-0"> AI 쏠 매니저와 상담하기 </h3>
      </div>
      <div className="card-body">
        <div className="chat-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`d-flex gap-3 mb-4 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {message.type === 'bot' && (
                <div
                  className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                  style={{ width: '40px', height: '40px', flexShrink: 0 }}
                >
                  <img
                    src={logo}
                    alt="Bot"
                    className="logo"
                    style={{ width: '40px', height: '40px' }}
                  />
                </div>
              )}
              <div
                className="flex-grow-1"
                style={{
                  textAlign: message.type === 'user' ? 'right' : 'left',
                  width: '100%',
                }}
              >
                <div
                  className={`p-3 rounded`}
                  style={{
                    display: 'inline-block',
                    maxWidth: '70%',
                    margin: message.type === 'user' ? '0 0 0 auto' : '0 auto 0 0',
                    wordWrap: 'break-word',
                    backgroundColor: message.type === 'user' ? '#FAE7F7' : '#E5EDFD',
                    color: '#000000',
                  }}
                >
                  <p className="mb-0">{message.content.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="input-group">
            <textarea
              ref={textareaRef}
              className="form-control"
              placeholder="궁금한 투자 정보를 문의해세요!"
              aria-label="Message input"
              value={input}
              onChange={handleInputChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              style={{
                overflow: "auto",
                resize: "none",
                height: "40px",
              }}
            />
            <button className="btn btn-purple" type="button" onClick={sendMessage}>
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatGPT;

