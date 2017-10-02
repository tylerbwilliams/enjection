
const assert = require('assert');

const factories = Object.create( null );
const packages = Object.create( null );
const proxy = new Proxy( packages, {
	get( pkgs, prop, _proxy ) {
		if ( pkgs[prop] === undefined ) {
			assert.ok(
				factories[prop],
				`No registration for module: ${prop}`
			);
			pkgs[prop] = factories[prop]( _proxy );
		}
		return pkgs[prop];
	},
	set() {
		return false;
	},
	deleteProperty() {
		return false;
	}
});

const inject = exports.inject = ( name, pkg )=> {
	assert.ok( typeof name === 'string' && name !== '',
		'Enjection#inject: name must be a non-empty string value.'
	);
	assert.ok( typeof pkg !== undefined,
		'Enjection#inject: package must NOT be undefined.'
	);
	packages[name] = pkg;
};

const injectAll = exports.injectAll = ( pkgs )=> {
	assert.ok( typeof pkgs === 'object' && pkgs !== null,
		'Enjection#injectAll: packages must be a non-null object.'
	);
	Object.keys( pkgs ).forEach( name => {
		assert.ok( typeof pkgs[name] !== undefined,
			'Enjection#injectAll: package must NOT be undefined.'
		);
		inject( name, pkgs[name] );
	});
};

const register = exports.register = ( name, factory )=> {
	assert.ok( typeof name === 'string' && name !== '',
		'Enjection#register: name must be a non-empty string value.'
	);
	assert.ok( typeof factory === 'function',
		'Enjection#register: module factory must be a function.'
	);
	factories[name] = factory;
};

const reset = exports.reset = ()=> {
	for ( factory in factories )
		delete factories[factory];
	for ( pkg in packages )
		delete packages[pkg];
};

const resolve = exports.resolve = ( name )=> {
	assert.ok( typeof name === 'string' && name !== '',
		'Enjection#resolve: name must be a non-empty string value.'
	);
	return proxy[name];
};
