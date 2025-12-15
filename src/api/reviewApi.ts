import { apiClient } from './client';
import type { ReviewData } from '../types';

export interface CreateReviewDto {
  content: string;
  rating: number;
  grassType: string;
  grassConditions: string[];
  recommendedShoe: string;
  shoeLink?: string;
}

export interface UpdateReviewDto {
  content: string;
  rating: number;
  grassType: string;
  grassConditions: string[];
  recommendedShoe: string;
  shoeLink?: string;
}

export interface ReviewResponseDto {
  reviewId: number;
  fieldId: number;
  userId: number;
  userName?: string;
  content: string;
  rating: number;
  grassType: string;
  grassConditions: string[];
  recommendedShoe: string;
  shoeLink?: string;
  createdAt: string;
  updatedAt: string;
}

// 리뷰 목록 조회
export const getReviews = async (fieldId: string, lastId?: number): Promise<ReviewData[]> => {
  const params = lastId ? { lastId } : {};
  const response = await apiClient.get<ReviewResponseDto[]>(`/fields/${fieldId}/reviews`, { params });

  // 백엔드 응답을 프론트엔드 타입으로 변환
  return response.data.map(review => ({
    id: review.reviewId.toString(),
    fieldId: review.fieldId.toString(),
    userId: review.userId.toString(),
    author: review.userName || `User ${review.userId}`,
    grassType: review.grassType as any,
    rating: review.rating,
    grassConditions: review.grassConditions as any[],
    recommendedShoe: review.recommendedShoe as any,
    shoeLink: review.shoeLink,
    content: review.content,
    createdAt: review.createdAt,
  }));
};

// 리뷰 작성
export const createReview = async (fieldId: string, data: CreateReviewDto): Promise<ReviewData> => {
  const response = await apiClient.post<ReviewResponseDto>(`/fields/${fieldId}/reviews`, data);

  return {
    id: response.data.reviewId.toString(),
    fieldId: response.data.fieldId.toString(),
    userId: response.data.userId.toString(),
    author: response.data.userName || `User ${response.data.userId}`,
    grassType: response.data.grassType as any,
    rating: response.data.rating,
    grassConditions: response.data.grassConditions as any[],
    recommendedShoe: response.data.recommendedShoe as any,
    shoeLink: response.data.shoeLink,
    content: response.data.content,
    createdAt: response.data.createdAt,
  };
};

// 리뷰 수정
export const updateReview = async (reviewId: string, data: UpdateReviewDto): Promise<ReviewData> => {
  const response = await apiClient.put<ReviewResponseDto>(`/reviews/${reviewId}`, data);

  return {
    id: response.data.reviewId.toString(),
    fieldId: response.data.fieldId.toString(),
    userId: response.data.userId.toString(),
    author: response.data.userName || `User ${response.data.userId}`,
    grassType: response.data.grassType as any,
    rating: response.data.rating,
    grassConditions: response.data.grassConditions as any[],
    recommendedShoe: response.data.recommendedShoe as any,
    shoeLink: response.data.shoeLink,
    content: response.data.content,
    createdAt: response.data.createdAt,
  };
};

// 리뷰 삭제
export const deleteReview = async (reviewId: string): Promise<void> => {
  await apiClient.delete(`/reviews/${reviewId}`);
};

// Alias for backwards compatibility
export const getReviewsByFieldId = getReviews;
