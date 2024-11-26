import React from 'react';
import { Form } from 'react-bootstrap';

export const PropertyDocs = ({ formData, setFormData }) => {
  return (
    <Form.Group className="mb-4">
      <Form.Label>법적 서류</Form.Label>
      <Form.Control 
        type="text" 
        placeholder="파일선택 선택된 파일 없음"
        readOnly
        value={formData.legalDocs}
        onChange={(e) => setFormData({...formData, legalDocs: e.target.value})}
      />
      <Form.Text className="text-muted">
        건물 소유권 증명서, 감정평가서 등의 법적 서류를 업로드하세요
      </Form.Text>
    </Form.Group>
  );
};

