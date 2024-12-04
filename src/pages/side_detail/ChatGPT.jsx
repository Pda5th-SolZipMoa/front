import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap';
import { Send } from 'react-bootstrap-icons';
import logo from "/side_detail_gpt.png";
import "./ChatGPT.css";

function ChatGPT() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: { text: '일교님 안녕하세요. 저에게 투자정보를 문의하시면, 빠르고 신속하게 알려드릴게요.' }
    }
  ]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', content: { text: input } };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    setInput("");

    try {
      const response = await axios.post('api/chat', {
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
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <Container className="mt-5 chat-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
      <h4 className="card-title h5" style={{color:"#6C63FF"}}>SoLMoa에 질문하기</h4>
      </div>
      <div className="chat-messages" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.type}`}
          >
            {message.type === 'bot' && (
              <div className="bot-avatar">
                <img src={logo} alt="Bot" className="logo" />
              </div>
            )}
            <div className="message-content">
              <p>{message.content.text}</p>
            </div>
          </div>
        ))}
      </div>
      <Form className="mt-4 chat-input">
        <Form.Group className="d-flex">
          <Form.Control
            as="textarea"
            ref={textareaRef}
            placeholder="궁금한 투자 정보를 문의해세요!"
            value={input}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button onClick={sendMessage} className="send-button custom-send">
            <Send size={20} />
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
}

export default ChatGPT;

