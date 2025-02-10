  import React, { useEffect, useContext, useState } from 'react';
  import { TodoContext } from '../../context/TodoContext';
  import TodoItem from './TodoItem';

  const TodoList = () => {
    const { state, getTodos, addTodo } = useContext(TodoContext);
    const { todos, loading, error } = state;
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
      getTodos();
      // eslint-disable-next-line
    }, []);

    const onSubmit = e => {
      e.preventDefault();
      if (title.trim() !== '') {
        // Validate deadline if provided
        if (deadline) {
          const selectedDate = new Date(deadline);
          const now = new Date();
          if (selectedDate < now) {
            return; // Do not add the todo
          }
        }
        // Format deadline as ISO string if provided, otherwise null
        const formattedDeadline = deadline ? new Date(deadline).toISOString() : null;
        
        // Call addTodo; the toast is handled in TodoContext.js
        addTodo({ title, deadline: formattedDeadline });
        setTitle('');
        setDeadline('');
      }
    };

    const filteredTodos = todos.filter(todo => {
      if (filter === 'all') return true;
      if (filter === 'completed') return todo.completed;
      if (filter === 'pending') return !todo.completed;
      return true;
    });

    return (
      <div className="container mt-5">
        <h2>Your Todos</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={onSubmit} className="mb-4">
          <div className="input-group">
            <input
              type="text"
              placeholder="Add Todo..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="form-control"
              required
            />
            <input
              type="datetime-local"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="form-control"
            />
            <button type="submit" className="btn btn-success">Add Todo</button>
          </div>
        </form>

        <div className="mb-3">
          <button className={`btn btn-${filter==='all' ? 'primary' : 'outline-primary'} me-2`} onClick={() => setFilter('all')}>
            All
          </button>
          <button className={`btn btn-${filter==='completed' ? 'primary' : 'outline-primary'} me-2`} onClick={() => setFilter('completed')}>
            Completed
          </button>
          <button className={`btn btn-${filter==='pending' ? 'primary' : 'outline-primary'}`} onClick={() => setFilter('pending')}>
            Pending
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : filteredTodos.length === 0 ? (
          <p>No todos found</p>
        ) : (
          filteredTodos.map(todo => <TodoItem key={todo._id} todo={todo} />)
        )}
      </div>
    );
  };

  export default TodoList;
