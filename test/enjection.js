
const assert = require('assert');
const { inject, injectAll, register, reset, resolve } = require('../');

describe('#inject', ()=> {
	afterEach(()=> {
		reset();
	});

	it('should register a module dependency', ()=> {
		const module = { foo: 'bar' };
		inject('module', module);
		assert.equal(
			module,
			resolve('module'),
			'Returned standard modules do not match.'
		);
	});

	it('should use last injected module dependency', ()=> {
		const someModule = { bar: 'baz' };
		inject('module', someModule);
		const module = { foo: 'bar' };
		inject('module', module);
		assert.equal(
			module,
			resolve('module'),
			'Incorrect standard module resolved.'
		);
	});
});

describe('#injectAll', ()=> {
	afterEach(()=> {
		reset();
	});

	it('should inject multiple standard modules', ()=> {
		const deps = {
			foo: 5,
			bar: 10,
			baz: false
		};
		injectAll( deps );
		assert.equal(
			resolve('foo'),
			deps.foo,
			'InjectAll dependency resolved incorrectly.'
		);
		assert.equal(
			resolve('bar'),
			deps.bar,
			'InjectAll dependency resolved incorrectly.'
		);
		assert.equal(
			resolve('baz'),
			deps.baz,
			'InjectAll dependency resolved incorrectly.'
		);
	});
});

describe('#reset', ()=> {
	const module = { foo: 'bar' };

	beforeEach(()=> {
		inject('module', module);
	});

	afterEach(()=> {
		reset();
	})

	it('should clear registered dependencies', ()=> {
		reset();
		assert.throws(
			()=> resolve('module'),
			'Test module should not be registered.'
		);
	});

	it('should NOT prevent re-registrations', ()=> {
		assert.equal(
			module,
			resolve('module'),
			'Returned modules do not match.'
		);
	});
});

describe('#register', ()=> {
	const dep = { value: 'bar' };

	beforeEach(()=> {
		inject('dep', dep);
	});

	afterEach(()=> {
		reset();
	});

	it('should register a DI module', ()=> {
		const myDIModule = ({ dep })=> {
			return dep.value;
		};
		register('myDIModule', myDIModule);
		const value = resolve('myDIModule');
		assert.equal(
			value,
			dep.value,
			'DI Module did not receive dependency value.'
		);
	});

	it('should use last registered DI module', ()=> {
		const someDIModule = ()=> 5;
		register('myDIModule', someDIModule);
		const myDIModule = ({ dep })=> {
			return dep.value;
		};
		register('myDIModule', myDIModule);
		const value = resolve('myDIModule');
		assert.equal(
			value,
			dep.value,
			'Incorrect DI module was resolved.'
		);
	});
});

describe('#resolve', ()=> {
	
	afterEach(()=> {
		reset();
	});

	it('should return the value of DI module', ()=> {
		const value = 5;
		const diModule = ()=> value;
		register('diModule', diModule);
		const resolved = resolve('diModule');
		assert.equal(
			resolved,
			value,
			'DI Module did not receive dependency value.'
		);
	});

	it('should return the value of standard module', ()=> {
		const module = 10;
		inject('module', module);
		const resolved = resolve('module');
		assert.equal(
			resolved,
			module,
			'Std Module did not receive dependency value.'
		);
	});

	it('should resolve all dependencies', ()=> {
		const dep = ()=> 5;
		const diModule = ({ dep })=> {
			return dep;
		};
		register('dep', dep);
		register('diModule', diModule);
		const actual = resolve('diModule');
		const expected = dep();
		assert.equal(
			actual,
			expected,
			'Sub dependencies not resolved correctly.'
		);
	});
});
