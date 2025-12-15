export type GrassType = 'AG' | 'FG' | 'MG' | 'TF';

export type GrassCondition =
  | '딱딱함'
  | '부드러움'
  | '잔디 김'
  | '잔디 짧음'
  | '울퉁불퉁함'
  | '관리 양호'
  | '배수 양호'
  | '미끄러움';

export interface SoccerField {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  grassType: GrassType;
  image?: string;
  reviewCount: number;
  avgRating: number;
}

export interface Review {
  id: string;
  fieldId: string;
  author: string;
  grassType: GrassType;
  recommendedShoe: GrassType;
  rating: number;
  grassConditions: GrassCondition[];
  content: string;
  shoeLink?: string;
  helpful: number;
  createdAt: string;
}

export const GRASS_TYPES: Record<GrassType, { label: string; description: string }> = {
  AG: { label: 'AG', description: '인조잔디용' },
  FG: { label: 'FG', description: '천연잔디용' },
  MG: { label: 'MG', description: '맨땅용' },
  TF: { label: 'TF', description: '풋살용' },
};

// 새로운 타입 추가
export interface FieldData {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  image: string;
  grassType: {
    code: string;
    name: string;
  };
  shoeType: {
    code: string;
    name: string;
  };
  grassCondition: {
    hard: number;
    short: number;
    slippery: number;
    bumpy: number;
  };
  rating: {
    average: number;
    distribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
}

export interface ReviewData {
  id: string;
  fieldId: string;
  userId: string;
  author: string;
  grassType: GrassType;
  rating: number;
  grassConditions: GrassCondition[];
  recommendedShoe: GrassType;
  shoeLink?: string;
  content: string;
  createdAt: string;
}

export interface CommentData {
  id: string;
  reviewId: string;
  userId: string;
  author: string;
  content: string;
  createdAt: string;
  parentId?: string;
  replies?: CommentData[];
}
