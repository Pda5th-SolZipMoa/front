import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

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
      <Form.Label className="fw-medium">{label}</Form.Label>
      <InputGroup>
        <Form.Control
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onClick={onClick}
          readOnly={readOnly}
          style={{
            cursor: readOnly ? 'pointer' : 'text',
            backgroundColor: readOnly ? '#f8f9fa' : '#fff',
          }}
        />
        {suffix && (
          <InputGroup.Text style={{ backgroundColor: '#f8f9fa', color: '#6c757d' }}>
            {suffix}
          </InputGroup.Text>
        )}
      </InputGroup>
    </Form.Group>
  );
};

