import './App.css'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import MovieHomesc from './pages/MovieHomesc';
import Favorites from './pages/Favorites';
import AsktoAi from './pages/AsktoAi';
import ProtectedRoute from '../components/ProtectedRoute';

function LoginRoute() {
  const navigate = useNavigate();
  return <Login onBack={() => navigate('/')} onSuccess={() => navigate('/movies')} />;
}

function RegisterRoute() {
  const navigate = useNavigate();
  return <Register onBack={() => navigate('/')} />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/register" element={<RegisterRoute />} />
      <Route path="/movies" element={
        <ProtectedRoute>
          <MovieHomesc />
        </ProtectedRoute>
      } />
      <Route path="/favorites" element={
        <ProtectedRoute>
          <Favorites />
        </ProtectedRoute>
      } />
      <Route path="/asktoAi" element={
        <ProtectedRoute>
          <AsktoAi />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;