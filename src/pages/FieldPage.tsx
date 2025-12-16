import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import { Search } from 'lucide-react';
import { FieldSidebar } from '../components/FieldSidebar';
import type { ReviewFormData } from '../components/ReviewModal';
import { AddFieldModal } from '../components/AddFieldModal';
import type { AddFieldFormData } from '../components/AddFieldModal';
import type { FieldData, ReviewData, CommentData } from '../types/index';
import * as fieldApi from '../api/fieldApi';
import * as reviewApi from '../api/reviewApi';
import * as commentApi from '../api/commentApi';
import { useAuth } from '../contexts/AuthContext';
import 'leaflet/dist/leaflet.css';
import './FieldPage.css';
import L from 'leaflet';

// 커스텀 마커 아이콘
const customIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="58" height="76" viewBox="0 0 58 76" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M29 0C13.0132 0 0 13.0132 0 29C0 50.75 29 75.2236 29 75.2236C29 75.2236 58 50.75 58 29C58 13.0132 44.9868 0 29 0ZM29 39.3421C23.2868 39.3421 18.6579 34.7132 18.6579 29C18.6579 23.2868 23.2868 18.6579 29 18.6579C34.7132 18.6579 39.3421 23.2868 39.3421 29C39.3421 34.7132 34.7132 39.3421 29 39.3421Z" fill="#10b981"/>
    </svg>
  `),
  iconSize: [40, 53],
  iconAnchor: [20, 53],
});

const selectedIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="58" height="76" viewBox="0 0 58 76" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M29 0C13.0132 0 0 13.0132 0 29C0 50.75 29 75.2236 29 75.2236C29 75.2236 58 50.75 58 29C58 13.0132 44.9868 0 29 0ZM29 39.3421C23.2868 39.3421 18.6579 34.7132 18.6579 29C18.6579 23.2868 23.2868 18.6579 29 18.6579C34.7132 18.6579 39.3421 23.2868 39.3421 29C39.3421 34.7132 34.7132 39.3421 29 39.3421Z" fill="#3be878"/>
    </svg>
  `),
  iconSize: [44, 58],
  iconAnchor: [22, 58],
});

export const FieldPage = () => {
  const { user } = useAuth();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedField, setSelectedField] = useState<FieldData | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [fields, setFields] = useState<FieldData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [isLoadingFields, setIsLoadingFields] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const mapRef = useRef<L.Map | null>(null);

  // 백엔드에서 축구장 목록 가져오기
  useEffect(() => {
    const fetchFields = async () => {
      try {
        setIsLoadingFields(true);
        const fetchedFields = await fieldApi.getFields();

        const transformedFields: FieldData[] = fetchedFields.map(field => ({
          id: field.id,
          name: field.name,
          address: field.address,
          lat: field.lat,
          lng: field.lng,
          image: field.image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
          grassType: { code: field.grassType, name: field.grassType },
          shoeType: { code: field.shoeType, name: field.shoeType },
          grassCondition: { hard: 0, short: 0, slippery: 0, bumpy: 0 },
          rating: {
            average: field.rating,
            distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          },
        }));

        setFields(transformedFields);
      } catch (error) {
        console.error('Failed to fetch fields:', error);
      } finally {
        setIsLoadingFields(false);
      }
    };

    fetchFields();
  }, []);

  const filteredFields = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return [];

    return fields.filter(
      (field) =>
        field.name.toLowerCase().includes(keyword) ||
        field.address.toLowerCase().includes(keyword)
    );
  }, [searchKeyword, fields]);

  const handleFieldSelect = (field: FieldData) => {
    setSelectedField(field);
    setSearchKeyword(field.name);
    setShowResults(false);
  };

  const handleMarkerClick = async (field: FieldData) => {
    setSelectedField(field);

    try {
      // 리뷰 가져오기 (처음 로드)
      const fetchedReviews = await reviewApi.getReviewsByFieldId(field.id);

      // 10개 미만이면 더 이상 로드할 리뷰가 없음
      setHasMoreReviews(fetchedReviews.length >= 10);

      // 댓글 가져오기
      const allComments = await Promise.all(
        fetchedReviews.map((review: ReviewData) => commentApi.getCommentsByReviewId(review.id))
      );
      const flattenedComments = allComments.flat();

      // 잔디 상태 퍼센티지 계산
      const grassConditionCounts = {
        딱딱함: 0,
        '잔디 짧음': 0,
        미끄러움: 0,
        울퉁불퉁함: 0,
      };

      let totalConditions = 0;
      fetchedReviews.forEach((review: ReviewData) => {
        review.grassConditions.forEach((condition: string) => {
          if (condition === '딱딱함') {
            grassConditionCounts.딱딱함++;
            totalConditions++;
          } else if (condition === '잔디 짧음') {
            grassConditionCounts['잔디 짧음']++;
            totalConditions++;
          } else if (condition === '미끄러움') {
            grassConditionCounts.미끄러움++;
            totalConditions++;
          } else if (condition === '울퉁불퉁함') {
            grassConditionCounts.울퉁불퉁함++;
            totalConditions++;
          }
        });
      });

      const grassCondition = {
        hard: totalConditions > 0 ? Math.round((grassConditionCounts.딱딱함 / totalConditions) * 100) : 0,
        short: totalConditions > 0 ? Math.round((grassConditionCounts['잔디 짧음'] / totalConditions) * 100) : 0,
        slippery: totalConditions > 0 ? Math.round((grassConditionCounts.미끄러움 / totalConditions) * 100) : 0,
        bumpy: totalConditions > 0 ? Math.round((grassConditionCounts.울퉁불퉁함 / totalConditions) * 100) : 0,
      };

      // 별점 분포 계산
      const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      fetchedReviews.forEach((review: ReviewData) => {
        ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
      });

      const totalReviews = fetchedReviews.length;
      const totalRating = fetchedReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalReviews > 0 ? Math.round((totalRating / totalReviews) * 10) / 10 : 0;

      // 필드 업데이트
      setSelectedField({
        ...field,
        grassCondition,
        rating: {
          average: averageRating,
          distribution: ratingDistribution,
        },
      });

      setReviews(fetchedReviews);
      setComments(flattenedComments);
    } catch (error) {
      console.error('Failed to fetch reviews and comments:', error);
      setReviews([]);
      setComments([]);
    }
  };

  const handleCloseSidebar = () => {
    setSelectedField(null);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (filteredFields[0]) {
      handleFieldSelect(filteredFields[0]);
    } else {
      setShowResults(false);
    }
  };

  const handleAddField = async (fieldData: AddFieldFormData) => {
    try {
      await fieldApi.createField({
        name: fieldData.name,
        address: fieldData.address,
        imageUrl: fieldData.imageUrl,
        grassType: fieldData.grassType,
        recommendedShoe: fieldData.recommendedShoe,
      });

      alert('축구장 등록 요청이 전송되었습니다!\n관리자 승인 후 지도에 표시됩니다.');
      setShowAddFieldModal(false);
    } catch (error: any) {
      console.error('Failed to create field:', error);
      alert('축구장 등록 요청에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleReviewSubmit = async (fieldId: string, reviewData: ReviewFormData) => {
    try {
      // API 호출
      const createdReview = await reviewApi.createReview(fieldId, {
        content: reviewData.content,
        rating: reviewData.rating,
        grassType: reviewData.grassType,
        grassConditions: reviewData.grassConditions,
        recommendedShoe: reviewData.recommendedShoe,
        shoeLink: reviewData.shoeLink,
      });

      // 리뷰 추가 (최신 리뷰가 맨 위로)
      setReviews([createdReview, ...reviews]);

      // 해당 필드의 평점 업데이트
      setFields(
        fields.map((field) => {
          if (field.id === fieldId) {
            const newDistribution = { ...field.rating.distribution };
            newDistribution[reviewData.rating as keyof typeof newDistribution]++;

            const totalReviews = Object.values(newDistribution).reduce((a, b) => a + b, 0);
            const totalRating = Object.entries(newDistribution).reduce(
              (sum, [rating, count]) => sum + parseInt(rating) * count,
              0
            );
            const newAverage = totalRating / totalReviews;

            const updatedField = {
              ...field,
              rating: {
                average: Math.round(newAverage * 10) / 10,
                distribution: newDistribution,
              },
            };

            // selectedField도 업데이트
            if (selectedField?.id === fieldId) {
              setSelectedField(updatedField);
            }

            return updatedField;
          }
          return field;
        })
      );

      alert('리뷰가 성공적으로 등록되었습니다!');
    } catch (error) {
      console.error('Failed to create review:', error);
      alert('리뷰 작성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCommentSubmit = async (reviewId: string, content: string, parentId?: string) => {
    try {
      await commentApi.createComment(reviewId, {
        content,
        parentId: parentId ? parseInt(parentId) : undefined,
      });

      // 댓글 목록 새로고침 (계층 구조 유지를 위해)
      const updatedComments = await commentApi.getCommentsByReviewId(reviewId);
      setComments(updatedComments);

      return true; // 성공 시 true 반환
    } catch (error) {
      console.error('Failed to create comment:', error);
      alert('댓글 작성에 실패했습니다. 다시 시도해주세요.');
      return false; // 실패 시 false 반환
    }
  };

  const handleReviewEdit = async (reviewId: string, newContent: string) => {
    try {
      const review = reviews.find((r) => r.id === reviewId);
      if (!review) return;

      await reviewApi.updateReview(reviewId, {
        content: newContent,
        rating: review.rating,
        grassType: review.grassType,
        grassConditions: review.grassConditions,
        recommendedShoe: review.recommendedShoe,
        shoeLink: review.shoeLink,
      });

      setReviews(
        reviews.map((r) =>
          r.id === reviewId ? { ...r, content: newContent } : r
        )
      );
    } catch (error) {
      console.error('Failed to update review:', error);
      alert('리뷰 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleReviewDelete = async (reviewId: string) => {
    try {
      await reviewApi.deleteReview(reviewId);
      setReviews(reviews.filter((review) => review.id !== reviewId));
      // 해당 리뷰의 댓글도 삭제
      setComments(comments.filter((comment) => comment.reviewId !== reviewId));
    } catch (error) {
      console.error('Failed to delete review:', error);
      alert('리뷰 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCommentEdit = async (commentId: string, newContent: string, reviewId: string) => {
    try {
      await commentApi.updateComment(commentId, { content: newContent });

      // 댓글 목록 새로고침 (계층 구조 유지를 위해)
      const updatedComments = await commentApi.getCommentsByReviewId(reviewId);
      setComments(updatedComments);
    } catch (error) {
      console.error('Failed to update comment:', error);
      alert('댓글 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCommentDelete = async (commentId: string, reviewId: string) => {
    try {
      await commentApi.deleteComment(commentId);

      // 댓글 목록 새로고침 (계층 구조 유지를 위해)
      const updatedComments = await commentApi.getCommentsByReviewId(reviewId);
      setComments(updatedComments);
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('댓글 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleLoadMoreReviews = async () => {
    if (!selectedField || isLoadingReviews || !hasMoreReviews) return;

    try {
      setIsLoadingReviews(true);

      // 마지막 리뷰 ID 가져오기
      const lastReviewId = reviews.length > 0 ? parseInt(reviews[reviews.length - 1].id) : undefined;

      // 추가 리뷰 가져오기
      const newReviews = await reviewApi.getReviewsByFieldId(selectedField.id, lastReviewId);

      // 새로운 리뷰의 댓글 가져오기
      const newComments = await Promise.all(
        newReviews.map((review: ReviewData) => commentApi.getCommentsByReviewId(review.id))
      );
      const flattenedNewComments = newComments.flat();

      // 리뷰와 댓글 추가
      setReviews([...reviews, ...newReviews]);
      setComments([...comments, ...flattenedNewComments]);

      // 10개 미만이면 더 이상 로드할 리뷰가 없음
      setHasMoreReviews(newReviews.length >= 10);
    } catch (error) {
      console.error('Failed to load more reviews:', error);
      alert('추가 리뷰를 불러오는데 실패했습니다.');
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (!selectedField || !mapRef.current) return;
    mapRef.current.flyTo([selectedField.lat, selectedField.lng], 14, {
      duration: 1.2,
    });
  }, [selectedField]);

  return (
    <div className="field-page">
      {/* 검색창 */}
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="축구장 이름 또는 주소 검색..."
            value={searchKeyword}
            onFocus={() => setShowResults(true)}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setShowResults(true);
            }}
            className="search-input"
          />
        </form>
        {filteredFields.length > 0 && showResults && (
          <ul className="search-results">
            {filteredFields.map((field) => (
              <li
                key={field.id}
                className="search-result-item"
                onClick={() => handleFieldSelect(field)}
              >
                <span className="search-result-name">{field.name}</span>
                <span className="search-result-address">{field.address}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 축구장 추가 버튼 */}
      <button className="add-field-btn" onClick={() => setShowAddFieldModal(true)}>
        축구장 추가
      </button>

      {/* 지도 */}
      <div
        style={{
          position: 'absolute',
          top: '81px',
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: 'calc(100vh - 81px)',
        }}
      >
        {isLoadingFields ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <p>축구장 목록을 불러오는 중...</p>
          </div>
        ) : (
          <MapContainer
            center={fields.length > 0 ? [fields[0].lat, fields[0].lng] : [37.5665, 126.9780]}
            zoom={7}
            style={{ width: '100%', height: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {fields.length === 0 && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1000,
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, fontSize: '1.1rem', color: '#666' }}>등록된 축구장이 없습니다.</p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#999' }}>축구장을 추가해보세요!</p>
              </div>
            )}
            {fields.map((field) => (
              <Marker
                key={field.id}
                position={[field.lat, field.lng]}
                icon={selectedField?.id === field.id ? selectedIcon : customIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(field),
                }}
              >
                {selectedField?.id === field.id && (
                  <Tooltip
                    direction="right"
                    offset={[14, 0]}
                    opacity={1}
                    permanent
                    className="field-name-tooltip"
                  >
                    {field.name}
                  </Tooltip>
                )}
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* 사이드바 */}
      {selectedField && (
        <FieldSidebar
          field={selectedField}
          reviews={reviews.filter((r) => r.fieldId === selectedField.id)}
          comments={comments}
          currentUserId={user?.userId || ''}
          currentUserName={user?.name || ''}
          onClose={handleCloseSidebar}
          onReviewSubmit={(reviewData) => handleReviewSubmit(selectedField.id, reviewData)}
          onCommentSubmit={handleCommentSubmit}
          onReviewEdit={handleReviewEdit}
          onReviewDelete={handleReviewDelete}
          onCommentEdit={handleCommentEdit}
          onCommentDelete={handleCommentDelete}
          onLoadMoreReviews={handleLoadMoreReviews}
          hasMoreReviews={hasMoreReviews}
          isLoadingReviews={isLoadingReviews}
        />
      )}

      {/* 축구장 추가 모달 */}
      {showAddFieldModal && (
        <AddFieldModal
          onClose={() => setShowAddFieldModal(false)}
          onSubmit={handleAddField}
        />
      )}
    </div>
  );
};
