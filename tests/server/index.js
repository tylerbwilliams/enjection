
const { inject, register, resolve } = require('../../src/enjection');

inject('express', require('express'));
inject('http', require('http'));
inject('url', require('url'));

register('createServer', require('./create-server'));
register('createApp', require('./create-app'));

const createServer = resolve('createServer');
const server = createServer();

server.listen(1337, ()=> console.log('Running...'));
