import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function ChatGPT() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { buildingData } = location.state || {};

  const fetchChatGPTResponses = async () => {
    setIsLoading(true);
    try {
      const questions = [
        `건물 정보에 대해 150자 내외로 알려주세요. 건물명: ${buildingData['건물정보']['건물명']}`,
        `해당 건물의 투자 정보에 대해 150자 내외로 설명해주세요. 건물명: ${buildingData['건물정보']['건물명']}`,
        `이 건물에 대한 향후 투자 전략을 200자 내외로 제안해주세요. 건물명: ${buildingData['건물정보']['건물명']}`
      ];

      const responses = await Promise.all(
        questions.map((question) =>
          axios.post('http://localhost:8000/api/chat', { user_message: question })
        )
      );

      const botMessages = responses.map((response, index) => {
        const categories = ["건물 정보", "투자 정보", "향후 투자 전략"];
        return {
          type: 'bot',
          content: {
            category: categories[index],
            text: response.data.bot_reply
          }
        };
      });

      setMessages(botMessages);
    } catch (error) {
      console.error("ChatGPT API 호출 오류:", error);
      setMessages([
        {
          type: 'bot',
          content: { category: "오류", text: "오류가 발생했습니다. 다시 시도해주세요." }
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatGPTResponses();
  }, []);

  const LoadingSpinner = () => (
    <svg width="24" height="24" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#666">
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="2">
          <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
          <path d="M36 18c0-9.94-8.06-18-18-18">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </g>
    </svg>
  );

  return (
    <div className="card mt-4">
      <div className="card-header">
        <h3 className="h5 mb-0">ChatGPT 건물 투자 정보</h3>
      </div>
      <div className="card-body">
        <div className="chat-container">
          {isLoading ? (
            <div className="mb-4">
              <div
                className="p-3 rounded d-flex align-items-center"
                style={{
                  backgroundColor: '#f5f5f5',
                  color: '#666666',
                  maxWidth: '100%',
                  margin: '10px 0',
                  fontSize: '0.9rem'
                }}
              >
                <LoadingSpinner />
                <p className="mb-0 ml-3" style={{ marginLeft: '12px' }}>
                  건물 정보, 투자 정보, 향후 투자 전략 생성중...
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className="mb-4">
                <div className="d-flex" style={{ width: '100%', marginBottom: '10px' }}>
                  <h5
                    className="text-primary"
                    style={{
                      width: '120px',
                      margin: '0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {message.content.category}
                  </h5>
                </div>
                <div className="d-flex" style={{ width: '100%' }}>
                  <div
                    className="p-3 rounded"
                    style={{
                      backgroundColor: '#E5EDFD',
                      color: '#000000',
                      wordWrap: 'break-word',
                      width: '100%',
                      minHeight: '100px'
                    }}
                  >
                    <p className="mb-0">{message.content.text}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatGPT;
