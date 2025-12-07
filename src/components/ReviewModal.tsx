import { useState } from 'react';
import { X } from 'lucide-react';
import type { GrassType, GrassCondition } from '../types';
import './ReviewModal.css';

interface ReviewModalProps {
  fieldName: string;
  onClose: () => void;
  onSubmit: (review: ReviewFormData) => void;
}

export interface ReviewFormData {
  grassType: GrassType;
  rating: number;
  grassConditions: GrassCondition[];
  recommendedShoe: GrassType;
  shoeLink: string;
  content: string;
}

const GRASS_TYPES: { value: GrassType; label: string; description: string }[] = [
  { value: 'AG', label: 'AG', description: '인조잔디용' },
  { value: 'FG', label: 'FG', description: '천연잔디용' },
  { value: 'MG', label: 'MG', description: '맨땅용' },
  { value: 'TF', label: 'TF', description: '풋살용' },
];

const GRASS_CONDITIONS: { value: GrassCondition; color: string }[] = [
  { value: '딱딱함', color: 'red' },
  { value: '부드러움', color: 'purple' },
  { value: '잔디 김', color: 'green' },
  { value: '잔디 짧음', color: 'yellow' },
  { value: '울퉁불퉁함', color: 'orange' },
];

export const ReviewModal = ({ fieldName, onClose, onSubmit }: ReviewModalProps) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    grassType: 'AG',
    rating: 0,
    grassConditions: [],
    recommendedShoe: 'AG',
    shoeLink: '',
    content: '',
  });

  const [errors, setErrors] = useState<{
    grassType?: string;
    rating?: string;
    content?: string;
  }>({});

  const handleGrassTypeSelect = (type: GrassType) => {
    setFormData({ ...formData, grassType: type });
    setErrors({ ...errors, grassType: undefined });
  };

  const handleRatingSelect = (rating: number) => {
    setFormData({ ...formData, rating });
    setErrors({ ...errors, rating: undefined });
  };

  const handleConditionToggle = (condition: GrassCondition) => {
    const conditions = formData.grassConditions.includes(condition)
      ? formData.grassConditions.filter((c) => c !== condition)
      : [...formData.grassConditions, condition];
    setFormData({ ...formData, grassConditions: conditions });
  };

  const handleShoeTypeSelect = (type: GrassType) => {
    setFormData({ ...formData, recommendedShoe: type });
  };

  const handleSubmit = () => {
    const newErrors: typeof errors = {};

    if (!formData.grassType) {
      newErrors.grassType = '잔디 타입을 선택해주세요';
    }
    if (formData.rating === 0) {
      newErrors.rating = '평점을 선택해주세요';
    }
    if (!formData.content.trim()) {
      newErrors.content = '리뷰 내용을 입력해주세요';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="review-modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="review-modal-content">
          <h2 className="review-modal-title">{fieldName} 리뷰 작성</h2>

          {/* 잔디 타입 */}
          <div className="form-section">
            <label className="form-label">
              잔디 타입 <span className="required">*</span>
            </label>
            <div className="grass-type-grid">
              {GRASS_TYPES.map((type) => (
                <button
                  key={type.value}
                  className={`grass-type-btn ${formData.grassType === type.value ? 'selected' : ''}`}
                  onClick={() => handleGrassTypeSelect(type.value)}
                >
                  <div className="grass-type-code">{type.label}</div>
                  <div className="grass-type-desc">{type.description}</div>
                </button>
              ))}
            </div>
            {errors.grassType && <div className="error-message">{errors.grassType}</div>}
          </div>

          {/* 잔디 상태 (별점) */}
          <div className="form-section">
            <label className="form-label">
              잔디 상태 <span className="required">*</span>
            </label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} className="star-btn" onClick={() => handleRatingSelect(star)}>
                  <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
                    <path
                      d="M23 4L28.09 18.26L43 19.27L32 29.14L35.18 44.02L23 36.77L10.82 44.02L14 29.14L3 19.27L17.91 18.26L23 4Z"
                      fill={star <= formData.rating ? '#fbbf24' : '#e5e7eb'}
                      stroke={star <= formData.rating ? '#fbbf24' : '#e5e7eb'}
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              ))}
            </div>
            {errors.rating && <div className="error-message">{errors.rating}</div>}
          </div>

          {/* 잔디 상태 특징 */}
          <div className="form-section">
            <label className="form-label">
              잔디 상태 특징 <span className="form-sublabel">(복수 선택 가능)</span>
            </label>
            <div className="condition-tags">
              {GRASS_CONDITIONS.map((condition) => (
                <button
                  key={condition.value}
                  className={`condition-tag ${condition.color} ${
                    formData.grassConditions.includes(condition.value) ? 'selected' : ''
                  }`}
                  onClick={() => handleConditionToggle(condition.value)}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    {formData.grassConditions.includes(condition.value) ? (
                      <path d="M12 3L5.5 9.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="2" />
                    )}
                  </svg>
                  <span>{condition.value}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 추천 축구화 */}
          <div className="form-section">
            <label className="form-label">
              추천 축구화 <span className="required">*</span>
            </label>
            <div className="grass-type-grid">
              {GRASS_TYPES.map((type) => (
                <button
                  key={type.value}
                  className={`grass-type-btn ${formData.recommendedShoe === type.value ? 'selected' : ''}`}
                  onClick={() => handleShoeTypeSelect(type.value)}
                >
                  <div className="grass-type-code">{type.label}</div>
                  <div className="grass-type-desc">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 추천 축구화 링크 */}
          <div className="form-section">
            <label className="form-label">추천 축구화 링크</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://www.nike.com/... (선택사항)"
              value={formData.shoeLink}
              onChange={(e) => setFormData({ ...formData, shoeLink: e.target.value })}
            />
          </div>

          {/* 리뷰 내용 */}
          <div className="form-section">
            <label className="form-label">
              리뷰 내용 <span className="required">*</span>
            </label>
            <textarea
              className="form-textarea"
              placeholder="잔디 상태와 경험을 자세히 공유해주세요"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
            />
            {errors.content && <div className="error-message">{errors.content}</div>}
          </div>

          {/* 버튼 */}
          <div className="form-actions">
            <button className="btn-cancel" onClick={onClose}>취소</button>
            <button className="btn-submit" onClick={handleSubmit}>리뷰 작성</button>
          </div>
        </div>
      </div>
    </div>
  );
};
