import { useState } from 'react';
import { X } from 'lucide-react';
import './AddFieldModal.css';

interface AddFieldModalProps {
  onClose: () => void;
  onSubmit: (fieldData: AddFieldFormData) => void;
}

export interface AddFieldFormData {
  name: string;
  address: string;
  imageUrl: string;
  grassType: string;
  recommendedShoe: string;
}

export const AddFieldModal = ({ onClose, onSubmit }: AddFieldModalProps) => {
  const [formData, setFormData] = useState<AddFieldFormData>({
    name: '',
    address: '',
    imageUrl: '',
    grassType: '',
    recommendedShoe: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    address?: string;
    imageUrl?: string;
    grassType?: string;
    recommendedShoe?: string;
  }>({});

  const handleSubmit = () => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = '축구장 이름을 입력해주세요';
    }
    if (!formData.address.trim()) {
      newErrors.address = '주소를 입력해주세요';
    }
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = '이미지 URL을 입력해주세요';
    }
    if (!formData.grassType) {
      newErrors.grassType = '잔디 종류를 선택해주세요';
    }
    if (!formData.recommendedShoe) {
      newErrors.recommendedShoe = '추천 축구화를 선택해주세요';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="add-field-modal-overlay" onClick={onClose}>
      <div className="add-field-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="add-field-modal-header">
          <h2 className="add-field-modal-title">축구장 등록 요청</h2>
          <button className="add-field-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="add-field-modal-content">
          <div className="add-field-modal-form">
            {/* 안내 메시지 */}
            <div className="info-box">
              <p>
                등록 요청을 보내주시면 관리자가 확인 후 승인합니다. 정확한 정보를 입력해주세요.
              </p>
            </div>

            {/* 축구장 이름 */}
            <div className="form-field">
              <label className="form-label">
                축구장 이름
                <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="예: 서울월드컵경기장 보조구장"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setErrors({ ...errors, name: undefined });
                }}
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>

            {/* 주소 */}
            <div className="form-field">
              <label className="form-label">
                주소
                <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="예: 서울특별시 마포구 성산동"
                value={formData.address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                  setErrors({ ...errors, address: undefined });
                }}
              />
              {errors.address && <div className="error-message">{errors.address}</div>}
            </div>

            {/* 이미지 URL */}
            <div className="form-field">
              <label className="form-label">
                이미지 URL
                <span className="required">*</span>
              </label>
              <input
                type="url"
                className="form-input"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => {
                  setFormData({ ...formData, imageUrl: e.target.value });
                  setErrors({ ...errors, imageUrl: undefined });
                }}
              />
              {errors.imageUrl && <div className="error-message">{errors.imageUrl}</div>}
            </div>

            {/* 잔디 종류 */}
            <div className="form-field">
              <label className="form-label">
                잔디 종류
                <span className="required">*</span>
              </label>
              <select
                className="form-select"
                value={formData.grassType}
                onChange={(e) => {
                  setFormData({ ...formData, grassType: e.target.value });
                  setErrors({ ...errors, grassType: undefined });
                }}
              >
                <option value="">선택하세요</option>
                <option value="AG">AG - 인조잔디</option>
                <option value="FG">FG - 천연잔디</option>
                <option value="HG">HG - 하드그라운드</option>
                <option value="MG">MG - 멀티그라운드</option>
              </select>
              {errors.grassType && <div className="error-message">{errors.grassType}</div>}
            </div>

            {/* 추천 축구화 */}
            <div className="form-field">
              <label className="form-label">
                추천 축구화
                <span className="required">*</span>
              </label>
              <select
                className="form-select"
                value={formData.recommendedShoe}
                onChange={(e) => {
                  setFormData({ ...formData, recommendedShoe: e.target.value });
                  setErrors({ ...errors, recommendedShoe: undefined });
                }}
              >
                <option value="">선택하세요</option>
                <option value="AG">AG - 인조잔디용</option>
                <option value="FG">FG - 천연잔디용</option>
                <option value="TF">TF - 풋살용</option>
                <option value="MG">MG - 멀티그라운드용</option>
              </select>
              {errors.recommendedShoe && <div className="error-message">{errors.recommendedShoe}</div>}
            </div>

            {/* 버튼 */}
            <div className="form-actions">
              <button className="btn-cancel" onClick={onClose}>
                취소
              </button>
              <button className="btn-submit" onClick={handleSubmit}>
                등록 요청
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
