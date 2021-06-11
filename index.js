const express = require('express');
const path = require('path');
const http = require('http');
const cors = require('cors');
const app = express();
const server = http.createServer(app);

require('dotenv').config();

const port = process.env.PORT || '4000';

app.get('/' , (req , res)=>{

    res.send('hello from simple server :)')
 
});
 
app.set('port', port);
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

process.on('uncaughtException', (exc) => {
    console.log(exc);
});



server.listen(port, () => console.log('> Server is up and running on port : ' + port));
