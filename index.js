const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

// change origin to ["https://moji-meals.vercel.app/"] when finished
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Access-Control-Allow-Origin"],
    credentials: true
  }
});

const PORT = process.env.PORT || 8888;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  users[socket.id] = {left: 0, top: 0}

  // message everybody including the messenger
  io.emit("init_user", users)
  // io.emit("joined")
  socket.on("user_ready", (txt) => {
    io.emit("joined", socket.id, txt)
  });

  socket.on("disconnect", ()=>{
    delete users[socket.id];
    io.emit("init_user", users)
  })
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});