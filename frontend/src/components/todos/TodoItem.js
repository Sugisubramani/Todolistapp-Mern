import React, { useContext, useState, useEffect } from 'react';
import { TodoContext } from '../../context/TodoContext';

// Helper function to convert a Date to a value suitable for the datetime-local input (local time)
const toDateTimeLocal = (date) => {
  const dt = new Date(date);
  // Adjust by subtracting the timezone offset so that the value is in local time
  dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
  return dt.toISOString().slice(0, 16);
};

const TodoItem = ({ todo }) => {
  const { updateTodo, deleteTodo } = useContext(TodoContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  
  // Initialize the edited deadline using local time formatting if deadline exists
  const [editedDeadline, setEditedDeadline] = useState(
    todo.deadline ? toDateTimeLocal(todo.deadline) : ''
  );

  // For dynamic overdue checking
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleComplete = () => {
    updateTodo(todo._id, { completed: !todo.completed });
  };

  const removeTodo = () => {
    deleteTodo(todo._id);
  };

  const saveEdit = () => {
    // Convert the local datetime string back to an ISO string (UTC)
    const utcDeadline = editedDeadline ? new Date(editedDeadline).toISOString() : null;
    updateTodo(todo._id, { title: editedTitle, deadline: utcDeadline });
    setIsEditing(false);
  };

  // Check if the todo is overdue: deadline exists, it's in the past compared to the current time, and it's not completed.
  const isOverdue =
    todo.deadline &&
    new Date(todo.deadline) < now &&
    !todo.completed;

  return (
    <div className="card mb-2">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={toggleComplete}
            className="form-check-input me-2"
          />
          <div>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="form-control mb-1"
                  style={{ maxWidth: '250px' }}
                />
                <input
                  type="datetime-local"
                  value={editedDeadline}
                  onChange={(e) => setEditedDeadline(e.target.value)}
                  className="form-control"
                  style={{ maxWidth: '250px' }}
                />
              </>
            ) : (
              <>
                <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                  {todo.title}
                </span>
                <br />
                {todo.deadline && (
                  <small className={isOverdue ? 'text-danger' : 'text-muted'}>
                    ⏳ Deadline: {new Date(todo.deadline).toLocaleString()}
                  </small>
                )}
              </>
            )}
          </div>
        </div>
        <div>
          {isEditing ? (
            <button className="btn btn-success btn-sm me-2" onClick={saveEdit}>
              Save
            </button>
          ) : (
            <button
              className="btn btn-secondary btn-sm me-2"
              onClick={() => setIsEditing(true)}
              disabled={todo.completed}  // Disables edit if completed
            >
              Edit
            </button>
          )}
          <button className="btn btn-danger btn-sm" onClick={removeTodo}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
