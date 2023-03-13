const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use("/css",express.static("./node_modules/bootstrap/dist/css"));
app.use("/js",express.static("./node_modules/bootstrap/dist/js"));

app.use(express.urlencoded({extended:true}));

app.set('view engine', 'ejs');

app.get('/chat/:username', (req, res) => {
  res.render('chat', { username:req.params.username});
});

app.get('/', (req, res) => {
  res.redirect('login');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  console.log('Hallo', req.body.username);
  res.redirect(`/chat/${req.body.username}`);
});

io.on('connection', (socket) => {

  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

});

server.listen(3000, () => {
  console.log('listening on localhost:3000');
});
