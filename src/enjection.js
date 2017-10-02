
const assert = require('assert');

const factories = Object.create(null);
const packages = Object.create(null);
const proxy = new Proxy(packages, {
	get(pkgs, prop, pkgsProxy) {
		if (!pkgs[prop]) {
			assert.ok(
				factories[prop],
				`No registration for module: ${prop}`
			);
			pkgs[prop] = factories[prop](pkgsProxy);
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
	packages[name] = pkg;
};

const register = exports.register = ( name, factory )=> {
	factories[name] = factory;
};

const reset = exports.reset = ()=> {
	for ( factory in factories )
		delete factories[factory];
	for ( pkg in packages )
		delete packages[pkg];
};

const resolve = exports.resolve = ( name )=> {
	return proxy[name];
};
