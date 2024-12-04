import React from 'react';
import { Form, Button } from 'react-bootstrap';

export const PropertyDocs = ({ formData, setFormData }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // 사용자가 선택한 파일
    if (file) {
      setFormData({ ...formData, legalDocs: file });
    }
  };

  const removeFile = () => {
    setFormData({ ...formData, legalDocs: null }); // 파일 상태 초기화
  };

  return (
    <Form.Group className="mb-4">
      <Form.Label>법적 서류</Form.Label>
      {formData.legalDocs ? (
        <div className="d-flex align-items-center">
          <span className="me-3">
            {formData.legalDocs.name} {/* 업로드된 파일 이름 표시 */}
          </span>
          <Button variant="danger" size="sm" onClick={removeFile}>
            ×
          </Button>
        </div>
      ) : (
        <Form.Control 
          type="file" 
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
        />
      )}
      <Form.Text className="text-muted">
        건물 소유권 증명서, 감정평가서 등의 법적 서류를 등록해 주세요
      </Form.Text>
    </Form.Group>
  );
};
