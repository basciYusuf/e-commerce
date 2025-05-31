import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
// import Register from './pages/Register'; // Register sayfası kaldırıldı
import Dashboard from './pages/Dashboard';
import { CssBaseline } from '@mui/material';

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        {/* Kayıt rotası kaldırıldı */}
        {/* <Route
          path="/register"
          element={token ? <Navigate to="/dashboard" replace /> : <Register />}
        /> */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
