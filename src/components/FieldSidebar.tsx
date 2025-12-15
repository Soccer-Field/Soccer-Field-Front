import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { FieldData, ReviewData, CommentData } from '../types/index';
import { ReviewModal } from './ReviewModal';
import type { ReviewFormData } from './ReviewModal';
import { ReviewList } from './ReviewList';
import './FieldSidebar.css';

interface FieldSidebarProps {
  field: FieldData;
  reviews: ReviewData[];
  comments: CommentData[];
  currentUserId: string;
  currentUserName: string;
  onClose: () => void;
  onReviewSubmit: (reviewData: ReviewFormData) => void;
  onCommentSubmit: (reviewId: string, content: string, parentId?: string) => Promise<boolean>;
  onReviewEdit: (reviewId: string, content: string) => void;
  onReviewDelete: (reviewId: string) => void;
  onCommentEdit: (commentId: string, content: string, reviewId: string) => void;
  onCommentDelete: (commentId: string, reviewId: string) => void;
}

export const FieldSidebar = ({ field, reviews, comments, currentUserId, currentUserName, onClose, onReviewSubmit, onCommentSubmit, onReviewEdit, onReviewDelete, onCommentEdit, onCommentDelete }: FieldSidebarProps) => {
  const totalReviews = Object.values(field.rating.distribution).reduce((a, b) => a + b, 0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviewList, setShowReviewList] = useState(false);

  const handleReviewSubmit = (reviewData: ReviewFormData) => {
    onReviewSubmit(reviewData);
    setShowReviewModal(false);
  };

  // 리뷰 목록이 표시되면 사이드바는 숨김
  if (showReviewList) {
    return (
      <ReviewList
        fieldName={field.name}
        reviews={reviews}
        comments={comments}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        onClose={onClose}
        onBack={() => setShowReviewList(false)}
        onCommentSubmit={onCommentSubmit}
        onReviewEdit={onReviewEdit}
        onReviewDelete={onReviewDelete}
        onCommentEdit={onCommentEdit}
        onCommentDelete={onCommentDelete}
      />
    );
  }

  return (
    <div className="field-sidebar-overlay">
      <div className="field-sidebar">
        {/* 헤더 */}
        <button className="back-button" onClick={onClose}>
          <ArrowLeft size={24} />
        </button>

        {/* 축구장 이미지 */}
        <div className="field-image-container">
          <img src={field.image} alt={field.name} className="field-image" />
        </div>

        {/* 축구장 이름 */}
        <h1 className="field-name">{field.name}</h1>

        {/* 주소 */}
        <div className="field-address">
          <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
            <path
              d="M6 0C2.69 0 0 2.69 0 6C0 10.5 6 15.5 6 15.5C6 15.5 12 10.5 12 6C12 2.69 9.31 0 6 0ZM6 8C4.9 8 4 7.1 4 6C4 4.9 4.9 4 6 4C7.1 4 8 4.9 8 6C8 7.1 7.1 8 6 8Z"
              fill="black"
            />
          </svg>
          <span>{field.address}</span>
        </div>

        {/* 잔디종류 & 추천 축구화 */}
        <div className="field-types-section">
          <div className="type-box">
            <div className="type-label">잔디종류</div>
            <div className="type-badge">
              <div className="type-code">{field.grassType.code}</div>
              <div className="type-name">{field.grassType.name}</div>
            </div>
          </div>

          <div className="type-box">
            <div className="type-label">추천 축구화</div>
            <div className="type-badge">
              <div className="type-code">{field.shoeType.code}</div>
              <div className="type-name">{field.shoeType.name}</div>
            </div>
          </div>
        </div>

        {/* 잔디 상태 특징 */}
        <div className="grass-condition-section">
          <h3 className="section-title">잔디 상태 특징</h3>
          <div className="condition-content">
            {/* 도넛 차트 */}
            <div className="donut-chart">
              <svg viewBox="0 0 200 200" className="chart-svg">
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#bfffc2"
                  strokeWidth="40"
                  strokeDasharray={`${field.grassCondition.hard * 4.4} 440`}
                  transform="rotate(-90 100 100)"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#097a20"
                  strokeWidth="40"
                  strokeDasharray={`${field.grassCondition.short * 4.4} 440`}
                  strokeDashoffset={`${-field.grassCondition.hard * 4.4}`}
                  transform="rotate(-90 100 100)"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#0d370a"
                  strokeWidth="40"
                  strokeDasharray={`${field.grassCondition.slippery * 4.4} 440`}
                  strokeDashoffset={`${-(field.grassCondition.hard + field.grassCondition.short) * 4.4}`}
                  transform="rotate(-90 100 100)"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#70a273"
                  strokeWidth="40"
                  strokeDasharray={`${field.grassCondition.bumpy * 4.4} 440`}
                  strokeDashoffset={`${-(field.grassCondition.hard + field.grassCondition.short + field.grassCondition.slippery) * 4.4}`}
                  transform="rotate(-90 100 100)"
                />
              </svg>
            </div>

            {/* 막대 리스트 - 박스 형태 */}
            <div className="condition-bars">
              <div className="condition-bar-item">
                <div className="bar-label">
                  <div className="bar-color" style={{ backgroundColor: '#4dcc86' }}></div>
                  <span>딱딱함</span>
                </div>
                <span className="bar-percentage">{field.grassCondition.hard}%</span>
              </div>

              <div className="condition-bar-item">
                <div className="bar-label">
                  <div className="bar-color" style={{ backgroundColor: '#097a20' }}></div>
                  <span>잔디가 짧음</span>
                </div>
                <span className="bar-percentage">{field.grassCondition.short}%</span>
              </div>

              <div className="condition-bar-item">
                <div className="bar-label">
                  <div className="bar-color" style={{ backgroundColor: '#0d370a' }}></div>
                  <span>미끄러움</span>
                </div>
                <span className="bar-percentage">{field.grassCondition.slippery}%</span>
              </div>

              <div className="condition-bar-item">
                <div className="bar-label">
                  <div className="bar-color" style={{ backgroundColor: '#70a273' }}></div>
                  <span>울퉁불퉁함</span>
                </div>
                <span className="bar-percentage">{field.grassCondition.bumpy}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 잔디 상태 평가 */}
        <div className="rating-section">
          <h3 className="section-title">잔디 상태 평가</h3>
          <div className="rating-content">
            {/* 별점 요약 */}
            <div className="rating-summary">
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={star <= Math.floor(field.rating.average) ? '#fbbf24' : '#e5e7eb'}
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                ))}
              </div>
              <div className="rating-average">{field.rating.average.toFixed(1)}</div>
              <div className="rating-label">평균 평점</div>
            </div>

            {/* 평점 분포 */}
            <div className="rating-distribution">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = field.rating.distribution[star as keyof typeof field.rating.distribution];
                const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                return (
                  <div key={star} className="distribution-row">
                    <span className="star-label">{star}점</span>
                    <div className="distribution-bar">
                      <div className="distribution-fill" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span className="distribution-count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="action-buttons">
          <button className="btn-outline" onClick={() => setShowReviewList(true)}>
            리뷰 자세히 보기
          </button>
          <button className="btn-primary" onClick={() => setShowReviewModal(true)}>
            리뷰 작성하기
          </button>
        </div>
      </div>

      {/* 리뷰 작성 모달 */}
      {showReviewModal && (
        <ReviewModal
          fieldName={field.name}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
};
