import { apiClient } from './client';

// ===== 요청 DTO =====
export interface SignupRequestDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LogoutRequestDto {
  token: string;
}

// ===== 응답 DTO =====
export interface SignupResponseDto {
  userId: number;
  token: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponseDto {
  accessToken: string;
  userId: number;
  email: string;
  nickname: string;
  role: string;
}

export interface LogoutResponseDto {
  success: boolean;
}

// ===== 프론트엔드 타입 =====
export interface User {
  userId: string;
  email: string;
  name: string;
  token: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// ===== API 함수 =====

/**
 * 회원가입
 */
export const signup = async (data: SignupRequestDto): Promise<User> => {
  const response = await apiClient.post<SignupResponseDto>('/auth/signup', data);

  // 토큰을 localStorage에 저장
  localStorage.setItem('token', response.data.token);

  return {
    userId: response.data.userId.toString(),
    email: response.data.email,
    name: response.data.name,
    token: response.data.token,
    role: response.data.role,
  };
};

/**
 * 로그인
 */
export const login = async (data: LoginRequestDto): Promise<User> => {
  const response = await apiClient.post<LoginResponseDto>('/auth/login', data);

  // 토큰을 localStorage에 저장
  localStorage.setItem('token', response.data.accessToken);

  return {
    userId: response.data.userId.toString(),
    email: response.data.email,
    name: response.data.nickname,
    token: response.data.accessToken,
    role: response.data.role,
  };
};

/**
 * 로그아웃
 */
export const logout = async (): Promise<void> => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      await apiClient.post<LogoutResponseDto>('/auth/logout', { token });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // 에러가 발생해도 로컬 스토리지는 정리
      localStorage.removeItem('token');
    }
  } else {
    localStorage.removeItem('token');
  }
};

/**
 * 현재 저장된 토큰 가져오기
 */
export const getStoredToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * 토큰이 있는지 확인
 */
export const isAuthenticated = (): boolean => {
  return !!getStoredToken();
};
