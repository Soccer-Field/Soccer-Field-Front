import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { FieldPage } from './pages/FieldPage';
import { AuthPage } from './pages/AuthPage';
import './App.css';

function AppRoutes() {
  const { isAuthenticated, login, signup } = useAuth();

  return (
    <div className="app">
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/auth"
          element={
            isAuthenticated ? (
              <Navigate to="/field" replace />
            ) : (
              <AuthPage onLogin={login} onSignup={signup} />
            )
          }
        />
        <Route
          path="/field"
          element={
            <ProtectedRoute>
              <FieldPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
