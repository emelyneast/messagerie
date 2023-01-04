const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

let tab = {};
let lastMes = [];

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {

});

function storeMes(pMesData){
  lastMes.push(pMesData);
  if(lastMes.length>100){
    lastMes.shift();
  }
}

io.on('connection', (socket) => {
  console.log('a user connected ');

  socket.on('newMessage', (msg) => {
    console.log('message: ' + msg);
    let newMesData = {msg: `<span class="author">${tab[socket.id].user}</span>: <span class="message">${msg}</span>`,author: tab[socket.id].user};
    io.emit('newMessage', newMesData);
    storeMes(newMesData);
  });

  socket.on('utilisateur', (user) => {
    console.log('utilisateur: ' + user + ' id = ' + socket.id);
    tab[socket.id] = { user: user };
    console.log("personne connecter : " + user);
    socket.emit('lastMesList',lastMes);
    let newMesData = {msg: `<span class="author authorServ">SERVER</span>: <span class="message">${user} s'est connecté !</span>`,  author: "SERVER"};
    io.emit('newMessage', newMesData)
    storeMes(newMesData);
  });



  socket.on('disconnect', () => {
    console.log('user disconnected ' + socket.id);
    let newMesData = {msg: `<span class="author authorServD">SERVER</span>: <span class="messageD">${tab[socket.id].user} s'est déconnecté !</span>`,   author: "SERVER"}
    io.emit('newMessage', newMesData)
    storeMes(newMesData);
  });
});
server.listen(3000, () => {
  console.log('listening on *:3000');
});