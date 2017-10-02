
module.exports = ({ http, createApp })=> ()=> {

	const app = createApp();

	const server = http.createServer( app );

	return server;
};
