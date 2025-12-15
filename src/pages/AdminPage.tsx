import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPendingFields, approveField } from '../api/fieldApi';
import type { Field } from '../api/fieldApi';
import './AdminPage.css';

export const AdminPage = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: isAuthLoading } = useAuth();
  const [pendingFields, setPendingFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const hasCheckedAuth = useRef(false);

  // 관리자 권한 체크 (인증 로딩이 완료된 후 한 번만)
  useEffect(() => {
    console.log('[AdminPage] Auth state:', { isAuthLoading, isAdmin, hasCheckedAuth: hasCheckedAuth.current });

    if (isAuthLoading) {
      return; // 아직 로딩 중이면 체크하지 않음
    }

    if (hasCheckedAuth.current) {
      return; // 이미 체크했으면 다시 체크하지 않음
    }

    hasCheckedAuth.current = true;

    if (!isAdmin) {
      console.log('[AdminPage] Redirecting to /fields - not admin');
      alert('관리자만 접근할 수 있는 페이지입니다.');
      navigate('/fields', { replace: true });
    }
  }, [isAdmin, isAuthLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchPendingFields();
    }
  }, [isAdmin]);

  const fetchPendingFields = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fields = await getPendingFields();
      setPendingFields(fields);
    } catch (err: any) {
      console.error('Failed to fetch pending fields:', err);
      setError('대기 중인 축구장 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (fieldId: string) => {
    if (processingIds.has(fieldId)) return;

    try {
      setProcessingIds(prev => new Set(prev).add(fieldId));
      await approveField(fieldId);

      // 승인 성공 시 목록에서 제거
      setPendingFields(prev => prev.filter(field => field.id !== fieldId));
      alert('축구장이 승인되었습니다!');
    } catch (err: any) {
      console.error('Failed to approve field:', err);
      alert('축구장 승인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldId);
        return newSet;
      });
    }
  };

  // 인증 로딩 중이거나 권한 없으면 처리
  if (isAuthLoading) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="loading-message">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="loading-message">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="error-message">{error}</div>
          <button className="retry-button" onClick={fetchPendingFields}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">관리자 페이지</h1>
          <p className="admin-subtitle">축구장 등록 요청 관리</p>
        </div>

        {pendingFields.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p className="empty-message">승인 대기 중인 축구장이 없습니다.</p>
          </div>
        ) : (
          <div className="pending-fields-list">
            <div className="list-header">
              <h2>승인 대기 중인 축구장 ({pendingFields.length})</h2>
            </div>

            <div className="fields-grid">
              {pendingFields.map(field => (
                <div key={field.id} className="field-card">
                  <div className="field-image-container">
                    {field.image ? (
                      <img
                        src={field.image}
                        alt={field.name}
                        className="field-image"
                      />
                    ) : (
                      <div className="field-image-placeholder">
                        <span>이미지 없음</span>
                      </div>
                    )}
                  </div>

                  <div className="field-info">
                    <h3 className="field-name">{field.name}</h3>
                    <p className="field-address">{field.address}</p>

                    <div className="field-details">
                      <div className="detail-item">
                        <span className="detail-label">잔디 타입:</span>
                        <span className="detail-value">{field.grassType}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">추천 축구화:</span>
                        <span className="detail-value">{field.shoeType}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">위치:</span>
                        <span className="detail-value">
                          {field.lat.toFixed(4)}, {field.lng.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="field-actions">
                    <button
                      className="approve-button"
                      onClick={() => handleApprove(field.id)}
                      disabled={processingIds.has(field.id)}
                    >
                      {processingIds.has(field.id) ? '처리 중...' : '승인'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
