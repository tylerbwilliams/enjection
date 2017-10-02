
module.exports = ({ express, url })=> ()=> {

	const app = express();

	app.use(( req, res, next )=> {
		const { pathname } = url.parse( req.url );
		console.log(`Request: ${pathname}`);
		return next();
	});

	app.get('/', ( req, res )=> {
		res.send('Home Page');
	});

	app.get('/pricing', ( req, res )=> {
		res.send('Pricing Page');
	});

	app.use(( req, res )=> {
		res.send('404 Not Found.');
	});

	return app;
};
