const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Embedded Mongoose Model (monolithic without separate models folder)
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, default: 'pending' }
});

const Task = mongoose.model('Task', taskSchema);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tasks')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error', err));

// Only partial routes implemented directly in server.js
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Missing: GET by ID, PUT by ID, DELETE by ID
// Missing: Modular routes and controller files
// Missing: Error handler middleware

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
