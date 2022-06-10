const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});
const io = socket(server);

const tasks = [];

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.emit('updateData', tasks);

  socket.on('addTask', (taskName) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    tasks.push(taskName);
    socket.broadcast.emit('addTask', taskName);
  });

  socket.on('removeTask', (id) => {
    tasks.filter((task) => task.id !== id);
    socket.broadcast.emit('removeTask', id);
  });
});

app.use((req, res) => {
  res.status(404).send({ message: '404 not found...' });
});