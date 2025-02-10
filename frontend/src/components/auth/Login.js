import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Inline, PasswordInput component
const PasswordInput = ({ value, onChange, placeholder = "Enter your password", name, required }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="input-group">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-control"
        required={required}
      />
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={() => setShow(prev => !prev)}
        aria-label="Toggle password visibility"
      >
        {show ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
};

const Login = () => {
  const { state, login } = useContext(AuthContext);
  const { isAuthenticated, error } = state;

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    login(formData);
  };

  // If the user is authenticated, redirect to the todo page
  if (isAuthenticated) {
    return <Navigate to="/todos" />;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            className="form-control"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <PasswordInput
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <p className="mt-3">
        Don't have an account? <Link to="/register">Signup here</Link>
      </p>
    </div>
  );
};

export default Login;
