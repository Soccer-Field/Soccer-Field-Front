import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  signup: (email: string, password: string, name: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  // 로컬 스토리지에서 사용자 정보 불러오기
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, password: string) => {
    // 실제로는 서버에 로그인 요청을 보내야 함
    // 여기서는 로컬 스토리지에서 사용자 확인
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData = { email: foundUser.email, name: foundUser.name };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      alert('로그인 성공!');
    } else {
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const signup = (email: string, password: string, name: string) => {
    // 실제로는 서버에 회원가입 요청을 보내야 함
    // 여기서는 로컬 스토리지에 저장
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // 이메일 중복 체크
    if (users.some((u: any) => u.email === email)) {
      alert('이미 등록된 이메일입니다.');
      return;
    }

    const newUser = { email, password, name };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // 회원가입 후 자동 로그인
    const userData = { email, name };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    alert('회원가입이 완료되었습니다!');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    alert('로그아웃되었습니다.');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
