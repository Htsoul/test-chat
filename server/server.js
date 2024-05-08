
let app = require('express')();
let server = require('http').createServer(app);
let io = require('socket.io')(server);

const PORT = 3001;

const msgList = [];


server.listen(PORT,() =>{
    console.log('服务器启动成功....')
})

io.on('connection', socket => {

    console.log('客户端已连接');

    socket.on('sendMessage', (data) => {
        console.log('Received: ', data);
        msgList.push(data);
        io.emit('receiveMessage', msgList);
      });
    
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });

})