import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Spinner, Container } from 'react-bootstrap';
import "./GPTSummary.css";

function GPTSummary() {
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

  return (
    <Container className="mt-5">
      <div className="gpt-summary-header mb-4">
      <h4 className="card-title h5" style={{color:"#6C63FF"}}>AI 건물 투자 정보</h4>
      </div>
      <div className="gpt-summary-messages">
        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3 text-muted">건물 정보, 투자 정보, 향후 투자 전략 생성중...</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="gpt-summary-message">
              <div className="message-content2">
                <h5 className="gpt-summary-category">{message.content.category}</h5>
                <p>{message.content.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Container>
  );
}

export default GPTSummary;
