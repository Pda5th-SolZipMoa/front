import React from 'react';
import { Form } from 'react-bootstrap';

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
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <div className="d-flex">
        <Form.Control
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onClick={onClick} // 클릭 이벤트 전달
          readOnly={readOnly} // 읽기 전용 여부
        />
        {suffix && <span className="input-group-text">{suffix}</span>}
      </div>
    </Form.Group>
  );
};
