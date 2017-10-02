
## Dependency Injection

When developing across modules, dependencies are normally introduced by the `require` statement.  This method has a drawback of tying the modules together by a specific relative (or even absolute) path, and makes testing more difficult since each module is tied to others.

There are existing Dependency Injection system out, however each one of them requires listing the necessary dependencies (usually by string) and then a number of references that the dependencies will be received in.

*enjection* solves this issue.  New modules are defined as a function that accepts a dependency object, and dependencies are recursively resolved as they are accessed off the dependency object.

This means you can define what dependencies all of your modules will use based on whether you are in development, production, testing, or more.  Also, each module does not need to know where another is to require it as a dependency.

## Usage

When starting up an application, you only need to register new modules and then execute one.  If a module is defined as an Enjection module, `register` is used.  If a module is a standard module (ex. `node_modules`) the `inject` function is used.  Finally, `resolve` is used to start resolving one of the modules.

*entry.js*
```
const { inject, register, resolve } = require('enjection');

inject('express', require('express'));
inject('http', require('http'));
inject('logger', require('some-logger'))

register('app', require('./app'));
register('createEndpoint', require('./create-endpoint'));

const server = resolve('app');
```

New modules are defined as either singletons or factories:

*app.js*
```
// Singleton module
module.exports = ({ express, http, createEndpoint })=> {
    const app = express();

    app.get('/', createEndpoint('Hello, Home Page!'));
    app.get('/contact', createEndpoint('Hello, Contact Page!'));
    app.get('/pricing', createEndpoint('Hello, Pricing Page!'));
    app.use((req, res)=> res.send('Not Found'));

    return http.createServer(app);
};
```

*create-endpoint.js*
```
// Factory module (just returns a function)
module.exports = ({ logger })=> (text)=> {
    return (req, res)=> {
        logger.info(text);
        res.send(text);
    };
};
```