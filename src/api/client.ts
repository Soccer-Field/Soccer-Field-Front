import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키를 포함한 요청을 허용
});

// 요청 인터셉터 - 인증 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // 서버에서 응답이 온 경우
      console.error('API Error:', error.response.data);

      // 401 Unauthorized - 로그인 필요
      if (error.response.status === 401) {
        // TODO: 로그인 페이지로 리다이렉트
        console.error('Unauthorized - Please login');
      }

      // 403 Forbidden - 권한 없음
      if (error.response.status === 403) {
        console.error('Forbidden - No permission');
      }

      // 404 Not Found
      if (error.response.status === 404) {
        console.error('Not Found');
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답이 없는 경우
      console.error('No response from server');
    } else {
      // 요청 설정 중 에러 발생
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);
