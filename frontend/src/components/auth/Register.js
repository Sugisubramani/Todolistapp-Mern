import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Inline, enhanced PasswordInput component with strength indicator
const PasswordInput = ({ value, onChange, placeholder = "Enter your password", name, required }) => {
  const [show, setShow] = useState(false);

  // Function to calculate password strength (score 0 to 5)
  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (!password) return score;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = calculatePasswordStrength(value);

  // Map score to a label and color
  let strengthLabel = '';
  let strengthColor = '';
  if (strength <= 1) {
    strengthLabel = 'Very Weak';
    strengthColor = 'red';
  } else if (strength === 2) {
    strengthLabel = 'Weak';
    strengthColor = 'orange';
  } else if (strength === 3) {
    strengthLabel = 'Moderate';
    strengthColor = 'goldenrod';
  } else if (strength === 4) {
    strengthLabel = 'Strong';
    strengthColor = 'lightgreen';
  } else if (strength >= 5) {
    strengthLabel = 'Very Strong';
    strengthColor = 'green';
  }

  return (
    <div>
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
      {value && (
        <div className="mt-1">
          <small style={{ color: strengthColor }}>{strengthLabel}</small>
          <div className="progress mt-1" style={{ height: '5px' }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${(strength / 5) * 100}%`, backgroundColor: strengthColor }}
              aria-valuenow={(strength / 5) * 100}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to validate password complexity
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return password.length >= minLength && hasUpper && hasLower && hasDigit && hasSpecial;
};

const Register = () => {
  const { state, register } = useContext(AuthContext);
  const { isAuthenticated, error, registered } = state;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { name, email, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();

    // Enforce strict password complexity
    if (!validatePassword(password)) {
      alert("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }

    register(formData);
  };

  // If already authenticated, redirect to /todos
  if (isAuthenticated) {
    return <Navigate to="/todos" />;
  }
  // If registration was successful, redirect to /login
  if (registered) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Signup</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            className="form-control"
            placeholder="Username"
            required
          />
        </div>
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
        <button type="submit" className="btn btn-primary">Signup</button>
      </form>
      <p className="mt-3">
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
};

export default Register;
