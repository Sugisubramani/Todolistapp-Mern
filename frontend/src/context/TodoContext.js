import React, { createContext, useReducer } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialState = {
  todos: [],
  loading: true,
  error: null,
};  

export const TodoContext = createContext(initialState);

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'GET_TODOS':
      return { ...state, todos: action.payload, loading: false };
    case 'ADD_TODO':
      return { ...state, todos: [action.payload, ...state.todos] };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo._id === action.payload._id ? action.payload : todo
        )
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo._id !== action.payload)
      };
    case 'TODO_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Get all todos for the authenticated user
  const getTodos = async () => {
    try {
      const res = await axios.get('/api/todos');
      dispatch({ type: 'GET_TODOS', payload: res.data });
    } catch (err) {
      toast.error('Failed to fetch todos');
      dispatch({
        type: 'TODO_ERROR',
        payload: err.response ? err.response.data.msg : err.message
      });
    }
  };

  // Add new todo with a deadline
const addTodo = async todoData => {
  try {
    const res = await axios.post('/api/todos', todoData);
    dispatch({ type: 'ADD_TODO', payload: res.data });
    
    if (res.data.deadline) {
      toast.success(`Todo added successfully!`);
    } else {
      toast.success("Todo added successfully! No deadline added.");
    }
  } catch (err) {
    toast.error('Failed to add todo');
    dispatch({
      type: 'TODO_ERROR',
      payload: err.response ? err.response.data.msg : err.message,
    });
  }
};


  // Update a todo 
  const updateTodo = async (id, updatedData) => {
    try {
      const res = await axios.put(`/api/todos/${id}`, updatedData);
      dispatch({ type: 'UPDATE_TODO', payload: res.data });
      const keys = Object.keys(updatedData);
      if (keys.length === 1 && keys.includes('completed')) {
        if (updatedData.completed) {
          toast.success('Todo marked as complete!', { autoClose: 1500 });
        } else {
          toast.info('Todo marked as pending!', { autoClose: 1500 });
        }
      } else {
        toast.success('Todo updated successfully!', { autoClose: 1500 });
      }
    } catch (err) {
      toast.error('Failed to update todo', { autoClose: 1500 });
      dispatch({
        type: 'TODO_ERROR',
        payload: err.response ? err.response.data.msg : err.message,
      });
    }
  };
  
  // Delete a todo
  const deleteTodo = async id => {
    try {
      await axios.delete(`/api/todos/${id}`);
      dispatch({ type: 'DELETE_TODO', payload: id });
      toast.success('Todo removed successfully!');
    } catch (err) {
      toast.error('Failed to delete todo');
      dispatch({
        type: 'TODO_ERROR',
        payload: err.response ? err.response.data.msg : err.message
      });
    }
  };

  return (
    <TodoContext.Provider
      value={{ state, getTodos, addTodo, updateTodo, deleteTodo }}
    >
      {children}
    </TodoContext.Provider>
  );
};
