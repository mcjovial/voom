const express = require('express');
const path = require('path');
const http = require('http');
const cors = require('cors');
const { disconnect } = require('process');
const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

require('dotenv').config();

const port = process.env.PORT || '4000';

// app.get('/' , (req , res)=>{

//     res.send('hello from simple server :)')
 
// });
 
app.set('port', port);
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

process.on('uncaughtException', (exc) => {
    console.log(exc);
});

io.on('connection', (socket) => {
    socket.emit('me', socket.id);
    socket.on('disconnect', () => {
        socket.broadcast.emit('callended');
    });
    socket.on('calluser', ({userToCall, signalData, from, name}) => {
        io.to(userToCall).emit('calluser', {signal: signalData, from, name});
    });
    socket.on('answercall', (data) => {
        io.to(data.to).emit('callaccepted', data.signal);
    });
});

// serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // set static folder 
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

server.listen(port, () => console.log('> Server is up and running on port : ' + port));
