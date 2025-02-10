import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
import '../styles/LandingPage.css'; 

const LandingPage = () => {
  const { isAuthenticated } = useContext(AuthContext); // Check login status
  const navigate = useNavigate(); 

  const handleTodoClick = () => {
    if (isAuthenticated) {
      navigate('/todos'); // Redirect to Todos if logged in
    } else {
      navigate('/register'); // Redirect to Register if not logged in
    }
  };

  return (
    <div className="landing-container">
      <header>
        <img src="/logo.png" alt="Logo" className="logo" />
        <h1>Hello there!❤️</h1>
      </header>
      <section className="landing-content">
        <p>
          Manage your tasks efficiently and never miss a deadline. 
          Whether you’re a busy professional or a student, our app helps you organize your tasks with ease.
        </p>
      </section>
      <button className="todo-btn" onClick={handleTodoClick}>
        Go to Todo
      </button>
    </div>
  );
};

export default LandingPage;
