const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Todo = require('../models/Todo');
const mongoose = require('mongoose');

// Get all todos for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error('GET /api/todos error:', err.message);
    res.status(500).send('Server error');
  }
});

// Creating a New Todo
router.post('/', auth, async (req, res) => {
  const { title, deadline } = req.body;
  console.log('Received data from frontend:', req.body);
  try {
    const newTodo = new Todo({
      title,
      deadline: deadline ? new Date(deadline) : null,
      user: req.user.id
    });
    const todo = await newTodo.save();
    console.log('Saved todo:', todo);
    res.json(todo);
  } catch (err) {
    console.error('POST /api/todos error:', err.message);
    res.status(500).send('Server error');
  }
});

//  Updating a Todo
router.put('/:id', auth, async (req, res) => {
  const { title, completed, deadline } = req.body;
  const updateFields = {};

  if (title !== undefined) updateFields.title = title;
  if (completed !== undefined) updateFields.completed = completed;
  if (deadline !== undefined) {
    if (deadline === '') {
      updateFields.deadline = null;
    } else {
      updateFields.deadline = new Date(deadline);
    }
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid Todo ID format:', req.params.id);
      return res.status(400).json({ msg: 'Invalid Todo ID' });
    }
    let todo = await Todo.findById(req.params.id);
    if (!todo) {
      console.log('Todo not found for ID:', req.params.id);
      return res.status(404).json({ msg: 'Todo not found' });
    }

    // Ensure the user owns the todo
    if (todo.user.toString() !== req.user.id) {
      console.log('User not authorized to update todo with ID:', req.params.id);
      return res.status(401).json({ msg: 'Not authorized' });
    }

    todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );
    res.json(todo);
  } catch (err) {
    console.error('PUT /api/todos/:id error:', err.message);
    res.status(500).send('Server error');
  }
});


// Delete a todo
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Attempting to delete todo with ID:', req.params.id);

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid Todo ID format:', req.params.id);
      return res.status(400).json({ msg: 'Invalid Todo ID' });
    }

    let todo = await Todo.findById(req.params.id);
    if (!todo) {
      console.log('Todo not found for ID:', req.params.id);
      return res.status(404).json({ msg: 'Todo not found' });
    }

    // Ensure the authenticated user owns the todo
    if (todo.user.toString() !== req.user.id) {
      console.log('User not authorized to delete todo with ID:', req.params.id);
      return res.status(401).json({ msg: 'Not authorized' });
    }

    console.log('Deleting todo:', todo);
    await Todo.findByIdAndDelete(req.params.id);
    console.log('Todo deleted successfully.');
    res.json({ msg: 'Todo removed' });
  } catch (err) {
    console.error('DELETE /api/todos/:id error:', err);
    res.status(500).send('Server error');
  }
});


module.exports = router;
