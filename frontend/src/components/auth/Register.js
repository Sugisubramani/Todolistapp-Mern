import React, { useState, useContext} from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const Register = () => {
  const { state, register } = useContext(AuthContext);
  const { isAuthenticated, error, registered } = state;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { name, email, password } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = e => {
    e.preventDefault();
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
          <input type="text" name="name" value={name} onChange={onChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input type="email" name="email" value={email} onChange={onChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input type="password" name="password" value={password} onChange={onChange} className="form-control" required />
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
