import { apiClient } from './client';
import type { CommentData } from '../types';

export interface CreateCommentDto {
  content: string;
  parentId?: number;
}

export interface UpdateCommentDto {
  content: string;
}

export interface CommentResponseDto {
  commentId: number;
  reviewId: number;
  userId: number;
  userName?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  parentId?: number;
}

export interface CreateCommentResponseDto {
  commentId: number;
  reviewId: number;
  userId: number;
  userName?: string;
  content: string;
  createdAt: string;
  parentId?: number;
}

// 댓글 목록 조회 (계층 구조로 변환)
export const getComments = async (reviewId: string): Promise<CommentData[]> => {
  const response = await apiClient.get<CommentResponseDto[]>(`/reviews/${reviewId}/comments`);

  const commentMap = new Map<string, CommentData>();
  const rootComments: CommentData[] = [];

  // 먼저 모든 댓글을 맵에 저장
  response.data.forEach(comment => {
    const commentData: CommentData = {
      id: comment.commentId.toString(),
      reviewId: comment.reviewId.toString(),
      userId: comment.userId.toString(),
      author: comment.userName || `User ${comment.userId}`,
      content: comment.content,
      createdAt: comment.createdAt,
      parentId: comment.parentId?.toString(),
      replies: [],
    };
    commentMap.set(commentData.id, commentData);
  });

  // 계층 구조 만들기
  commentMap.forEach(comment => {
    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push(comment);
      }
    } else {
      rootComments.push(comment);
    }
  });

  return rootComments;
};

// 댓글 작성
export const createComment = async (reviewId: string, data: CreateCommentDto): Promise<CommentData> => {
  const response = await apiClient.post<CreateCommentResponseDto>(`/reviews/${reviewId}/comments`, data);

  return {
    id: response.data.commentId.toString(),
    reviewId: response.data.reviewId.toString(),
    userId: response.data.userId.toString(),
    author: response.data.userName || `User ${response.data.userId}`,
    content: response.data.content,
    createdAt: response.data.createdAt,
    parentId: response.data.parentId?.toString(),
    replies: [],
  };
};

// 댓글 수정
export const updateComment = async (commentId: string, data: UpdateCommentDto): Promise<CommentData> => {
  const response = await apiClient.put<CommentResponseDto>(`/comments/${commentId}`, data);

  return {
    id: response.data.commentId.toString(),
    reviewId: response.data.reviewId.toString(),
    userId: response.data.userId.toString(),
    author: response.data.userName || `User ${response.data.userId}`,
    content: response.data.content,
    createdAt: response.data.createdAt,
    parentId: response.data.parentId?.toString(),
    replies: [],
  };
};

// 댓글 삭제
export const deleteComment = async (commentId: string): Promise<void> => {
  await apiClient.delete(`/comments/${commentId}`);
};

// Alias for backwards compatibility
export const getCommentsByReviewId = getComments;
