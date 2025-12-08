import { useState } from 'react';
import { MessageCircle, Send, Edit2, Trash2 } from 'lucide-react';
import type { CommentData } from '../types/index';
import './ReviewComments.css';

interface ReviewCommentsProps {
  reviewId: string;
  comments: CommentData[];
  currentUser: string;
  onSubmitComment: (reviewId: string, content: string) => void;
  onEditComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export const ReviewComments = ({ reviewId, comments, currentUser, onSubmitComment, onEditComment, onDeleteComment }: ReviewCommentsProps) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onSubmitComment(reviewId, newComment.trim());
      setNewComment('');
    }
  };

  const handleEditComment = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditContent(currentContent);
  };

  const handleSaveEdit = (commentId: string) => {
    if (editContent.trim()) {
      onEditComment(commentId, editContent.trim());
      setEditingCommentId(null);
      setEditContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      onDeleteComment(commentId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className="review-comments">
      <button
        className="comments-toggle"
        onClick={() => setShowComments(!showComments)}
      >
        <MessageCircle size={16} />
        댓글 {comments.length}개
      </button>

      {showComments && (
        <div className="comments-section">
          {/* 댓글 목록 */}
          {comments.length > 0 && (
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <div className="comment-info">
                      <span className="comment-author">{comment.author}</span>
                      <span className="comment-date">{formatDate(comment.createdAt)}</span>
                    </div>
                    {comment.author === currentUser && (
                      <div className="comment-actions">
                        <button
                          className="comment-action-btn"
                          onClick={() => handleEditComment(comment.id, comment.content)}
                          title="수정"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="comment-action-btn"
                          onClick={() => handleDeleteComment(comment.id)}
                          title="삭제"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  {editingCommentId === comment.id ? (
                    <div className="comment-edit-form">
                      <input
                        type="text"
                        className="comment-edit-input"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <div className="comment-edit-actions">
                        <button className="btn-cancel-comment" onClick={handleCancelEdit}>
                          취소
                        </button>
                        <button className="btn-save-comment" onClick={() => handleSaveEdit(comment.id)}>
                          저장
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="comment-content">{comment.content}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 댓글 작성 폼 */}
          <form className="comment-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="comment-input"
              placeholder="댓글을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              className="comment-submit-btn"
              disabled={!newComment.trim()}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
