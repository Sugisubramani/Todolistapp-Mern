// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage'; // Your landing page component
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TodoList from './components/todos/TodoList';
import PrivateRoute from './components/routes/PrivateRoute';
import PublicRoute from './components/routes/PublicRoute';
import Navbar from './components/layout/Navbar';
import { AuthProvider } from './context/AuthContext';
import { TodoProvider } from './context/TodoContext';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="py-4">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/todos" 
            element={
              <PrivateRoute>
                <TodoList />
              </PrivateRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

const AppWrapper = () => (
  <AuthProvider>
    <TodoProvider>
      <App />
    </TodoProvider>
  </AuthProvider>
);

export default AppWrapper;
