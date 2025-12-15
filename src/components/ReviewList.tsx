import { useState } from 'react';
import { ArrowLeft, X, ThumbsUp, ExternalLink, Edit2, Trash2 } from 'lucide-react';
import type { ReviewData, CommentData } from '../types';
import { ReviewComments } from './ReviewComments';
import './ReviewList.css';

interface ReviewListProps {
  fieldName: string;
  reviews: ReviewData[];
  comments: CommentData[];
  currentUserId: string;
  currentUserName: string;
  onClose: () => void;
  onBack: () => void;
  onCommentSubmit: (reviewId: string, content: string, parentId?: string) => Promise<boolean>;
  onReviewEdit: (reviewId: string, content: string) => void;
  onReviewDelete: (reviewId: string) => void;
  onCommentEdit: (commentId: string, content: string, reviewId: string) => void;
  onCommentDelete: (commentId: string, reviewId: string) => void;
}

const CONDITION_COLORS: Record<string, string> = {
  '딱딱함': 'red',
  '부드러움': 'purple',
  '잔디 김': 'green',
  '잔디 짧음': 'yellow',
  '울퉁불퉁함': 'orange',
  '관리 양호': 'emerald',
  '배수 양호': 'cyan',
  '미끄러움': 'blue',
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

export const ReviewList = ({ reviews, comments, currentUserId, currentUserName, onClose, onBack, onCommentSubmit, onReviewEdit, onReviewDelete, onCommentEdit, onCommentDelete }: ReviewListProps) => {
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleEditReview = (reviewId: string, currentContent: string) => {
    setEditingReviewId(reviewId);
    setEditContent(currentContent);
  };

  const handleSaveEdit = (reviewId: string) => {
    if (editContent.trim()) {
      onReviewEdit(reviewId, editContent.trim());
      setEditingReviewId(null);
      setEditContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditContent('');
  };

  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      onReviewDelete(reviewId);
    }
  };

  return (
    <div className="review-list-overlay">
      <div className="review-list-container">
        {/* 헤더 */}
        <div className="review-list-header">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
            <span>뒤로</span>
          </button>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 리뷰 목록 */}
        <div className="review-list-content">
          <h2 className="review-list-title">리뷰 {reviews.length}개</h2>

          <div className="reviews-container">
            {reviews.length === 0 ? (
              <div className="no-reviews">
                <p>아직 작성된 리뷰가 없습니다.</p>
                <p className="no-reviews-sub">첫 번째 리뷰를 작성해보세요!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="review-card">
                  {/* 작성자 정보 */}
                  <div className="review-header">
                    <div className="author-info">
                      <div className="author-name">{review.author}</div>
                      <div className="review-date">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M4.66667 1.16667V3.5M9.33333 1.16667V3.5M2.33333 5.83333H11.6667M3.5 2.33333H10.5C11.1903 2.33333 11.75 2.89298 11.75 3.58333V10.5C11.75 11.1904 11.1903 11.75 10.5 11.75H3.5C2.80965 11.75 2.25 11.1904 2.25 10.5V3.58333C2.25 2.89298 2.80965 2.33333 3.5 2.33333Z" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>{formatDate(review.createdAt)}</span>
                      </div>
                    </div>
                    <div className="review-header-right">
                      <div className="review-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} width="16" height="16" viewBox="0 0 16 16" fill={star <= review.rating ? '#fbbf24' : '#e5e7eb'}>
                            <path d="M8 1L10.09 5.26L15 5.27L11 8.14L12.18 13.02L8 10.77L3.82 13.02L5 8.14L1 5.27L5.91 5.26L8 1Z" />
                          </svg>
                        ))}
                      </div>
                      {review.userId === currentUserId && (
                        <div className="review-actions">
                          <button
                            className="action-btn edit-btn"
                            onClick={() => handleEditReview(review.id, review.content)}
                            title="수정"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteReview(review.id)}
                            title="삭제"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 잔디 타입 & 추천 축구화 */}
                  <div className="review-types">
                    <div className="type-section">
                      <div className="type-label">잔디 타입</div>
                      <div className="type-badge blue">
                        <span>{review.grassType}</span>
                      </div>
                    </div>
                    <div className="type-section">
                      <div className="type-label">추천 축구화</div>
                      <div className="type-badge blue">
                        <span>{review.recommendedShoe}</span>
                      </div>
                    </div>
                  </div>

                  {/* 잔디 상태 */}
                  {review.grassConditions.length > 0 && (
                    <div className="review-conditions">
                      <div className="conditions-label">잔디 상태</div>
                      <div className="conditions-tags">
                        {review.grassConditions.map((condition, index) => (
                          <div key={index} className={`condition-tag ${CONDITION_COLORS[condition] || 'gray'}`}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M12 3L5.5 9.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>{condition}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 리뷰 내용 */}
                  {editingReviewId === review.id ? (
                    <div className="review-edit-form">
                      <textarea
                        className="review-edit-textarea"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                      />
                      <div className="review-edit-actions">
                        <button className="btn-cancel-edit" onClick={handleCancelEdit}>
                          취소
                        </button>
                        <button className="btn-save-edit" onClick={() => handleSaveEdit(review.id)}>
                          저장
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="review-content">{review.content}</div>
                  )}

                  {/* 추천 축구화 링크 */}
                  {review.shoeLink && (
                    <a href={review.shoeLink} target="_blank" rel="noopener noreferrer" className="shoe-link">
                      <div className="shoe-link-icon">👟</div>
                      <div className="shoe-link-content">
                        <div className="shoe-link-title">추천 축구화 보기</div>
                        <div className="shoe-link-url">{review.shoeLink}</div>
                      </div>
                      <ExternalLink size={18} />
                    </a>
                  )}

                  {/* 도움됨 버튼 */}
                  <button className="helpful-btn">
                    <ThumbsUp size={16} />
                    <span>도움됨 0</span>
                  </button>

                  {/* 댓글 섹션 */}
                  <ReviewComments
                    reviewId={review.id}
                    comments={comments.filter((c) => c.reviewId === review.id)}
                    currentUserId={currentUserId}
                    currentUserName={currentUserName}
                    onSubmitComment={onCommentSubmit}
                    onEditComment={onCommentEdit}
                    onDeleteComment={onCommentDelete}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
