import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import EmailVerification from './pages/EmailVerification';
import Home from './pages/Home';
import NewNote from './pages/NewNote';
import ViewNote from './pages/ViewNote';
import EditNote from './pages/EditNote';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<EmailVerification />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/new-note"
        element={
          <ProtectedRoute>
            <NewNote />
          </ProtectedRoute>
        }
      />
      <Route
        path="/view-note/:id"
        element={
          <ProtectedRoute>
            <ViewNote />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-note/:id"
        element={
          <ProtectedRoute>
            <EditNote />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
