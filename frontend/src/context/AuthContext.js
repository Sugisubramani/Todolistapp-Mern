import React, { createContext, useReducer, useEffect, useRef } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import { toast } from 'react-toastify';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null,
  registered: false, // Track if registration was successful
};

export const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case 'REGISTER_SUCCESS':
      toast.success('Registration successful!', { toastId: 'regSuccess' });
      return {
        ...state,
        registered: true, // Set registered flag
        loading: false,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      setAuthToken(action.payload.token);
      toast.success('Authentication successful!', { toastId: 'authSuccess' });
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
        registered: false, // Clear registration flag on login
      };
    case 'AUTH_ERROR':
      setAuthToken(null);
      toast.error(action.payload || 'Authentication error', { toastId: 'authError' });
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload,
      };
    case 'LOGOUT':
      setAuthToken(null);
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: null,
      };
    case 'RESET_REGISTRATION': //Handle registration reset
      return {
        ...state,
        registered: false,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const didLoadUser = useRef(false);

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: 'NO_TOKEN' });
      return;
    }
    setAuthToken(token);
    try {
      const res = await axios.get('/api/auth/me');
      dispatch({ type: 'USER_LOADED', payload: res.data });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR', payload: err.response ? err.response.data.msg : err.message });
    }
  };

  const register = async (formData) => {
    try {
      const res = await axios.post('/api/auth/register', formData);
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
    } catch (err) {
      toast.error('Signup failed', { toastId: 'regError' });
      dispatch({ type: 'AUTH_ERROR', payload: err.response ? err.response.data.msg : err.message });
    }
  };

  const login = async (formData) => {
    try {
      const res = await axios.post('/api/auth/login', formData);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      setTimeout(() => loadUser(), 100);
    } catch (err) {
      toast.error('Login failed', { toastId: 'loginError' });
      dispatch({ type: 'AUTH_ERROR', payload: err.response ? err.response.data.msg : err.message });
    }
  };

  const logout = (navigate) => {
    dispatch({ type: 'LOGOUT' });
    toast.info('Logged out successfully', { toastId: 'logoutToast' });
    if (navigate) {
      navigate('/');
    }
  };

  //Function to reset registration state
  const resetRegistration = () => {
    dispatch({ type: 'RESET_REGISTRATION' });
  };

  useEffect(() => {
    if (!didLoadUser.current) {
      loadUser();
      didLoadUser.current = true;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, loadUser, register, login, logout, resetRegistration }}>
      {children}
    </AuthContext.Provider>
  );
};
