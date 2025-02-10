const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

connectDB();

// Init Middleware
app.use(express.json());
app.use(cors());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/todos', require('./routes/todos'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
