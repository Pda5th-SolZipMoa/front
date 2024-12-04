import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import './PropertyInput.css'; // 스타일 파일 임포트

export const PropertyInput = ({
  label,
  placeholder,
  value,
  onChange,
  onClick,
  type = 'text',
  suffix,
  readOnly,
}) => {
  return (
    <Form.Group className="property-input">
      <Form.Label>{label}</Form.Label>
      <InputGroup>
        <Form.Control
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onClick={onClick}
          readOnly={readOnly}
        />
        {suffix && (
          <InputGroup.Text>
            {suffix}
          </InputGroup.Text>
        )}
      </InputGroup>
    </Form.Group>
  );
};
