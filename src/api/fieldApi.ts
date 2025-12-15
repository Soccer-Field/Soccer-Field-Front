import { apiClient } from './client';

// ===== 요청 DTO =====
export interface CreateFieldDto {
  name: string;
  address: string;
  imageUrl?: string;
  grassType: string;
  recommendedShoe: string;
}

// ===== 응답 DTO =====
export interface FieldListResponseDto {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  image?: string;
  grassType: string;
  shoeType: string;
  rating: number;
}

export interface FieldDetailResponseDto {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  image?: string;
  grassType: string;
  shoeType: string;
  grassCondition?: string;
  rating: number;
}

export interface CreateFieldResponseDto {
  fieldId: number;
  status: string;
}

export interface ApproveFieldResponseDto {
  fieldId: number;
  status: string;
  message: string;
}

// ===== 프론트엔드 타입 =====
export interface Field {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  image?: string;
  grassType: string;
  shoeType: string;
  rating: number;
}

export interface FieldDetail extends Field {
  grassCondition?: string;
}

// ===== API 함수 =====

/**
 * 승인된 축구장 목록 조회
 */
export const getFields = async (): Promise<Field[]> => {
  const response = await apiClient.get<FieldListResponseDto[]>('/fields');

  return response.data.map((field: FieldListResponseDto) => ({
    id: field.id.toString(),
    name: field.name,
    address: field.address,
    lat: field.lat,
    lng: field.lng,
    image: field.image,
    grassType: field.grassType,
    shoeType: field.shoeType,
    rating: field.rating,
  }));
};

/**
 * 축구장 상세 정보 조회
 */
export const getFieldById = async (fieldId: string): Promise<FieldDetail> => {
  const response = await apiClient.get<FieldDetailResponseDto>(`/fields/${fieldId}`);

  return {
    id: response.data.id.toString(),
    name: response.data.name,
    address: response.data.address,
    lat: response.data.lat,
    lng: response.data.lng,
    image: response.data.image,
    grassType: response.data.grassType,
    shoeType: response.data.shoeType,
    grassCondition: response.data.grassCondition,
    rating: response.data.rating,
  };
};

/**
 * 키워드로 축구장 검색
 */
export const searchFields = async (keyword: string): Promise<Field[]> => {
  const response = await apiClient.get<FieldListResponseDto[]>('/fields/search', {
    params: { keyword },
  });

  return response.data.map((field: FieldListResponseDto) => ({
    id: field.id.toString(),
    name: field.name,
    address: field.address,
    lat: field.lat,
    lng: field.lng,
    image: field.image,
    grassType: field.grassType,
    shoeType: field.shoeType,
    rating: field.rating,
  }));
};

/**
 * 새 축구장 등록 요청
 */
export const createField = async (data: CreateFieldDto): Promise<CreateFieldResponseDto> => {
  const response = await apiClient.post<CreateFieldResponseDto>('/fields', data);
  return response.data;
};

/**
 * 승인 대기 중인 축구장 목록 조회 (관리자용)
 */
export const getPendingFields = async (): Promise<Field[]> => {
  const response = await apiClient.get<FieldListResponseDto[]>('/fields/pending');

  return response.data.map((field: FieldListResponseDto) => ({
    id: field.id.toString(),
    name: field.name,
    address: field.address,
    lat: field.lat,
    lng: field.lng,
    image: field.image,
    grassType: field.grassType,
    shoeType: field.shoeType,
    rating: field.rating,
  }));
};

/**
 * 축구장 승인 (관리자용)
 */
export const approveField = async (fieldId: string): Promise<ApproveFieldResponseDto> => {
  const response = await apiClient.patch<ApproveFieldResponseDto>(`/fields/${fieldId}/approve`);
  return response.data;
};
