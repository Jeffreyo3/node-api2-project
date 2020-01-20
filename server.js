const express = require('express');
const postsRouter = require('./routes/posts-router');

const server = express();

server.use(express.json());
server.use('/api/posts', postsRouter);

server.get('/', (req, res) => {
    res.send(`<h2>Jeff's Posts API Server Is Alive</h2>`);
});

module.exports = server;