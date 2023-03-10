# Decorators - Route

`@Route` is a decorator for your controller class methods. It defines your methods as **route**.

## Route Options

### `path` - Main path of your route.

This property sets where your route will be requested. Example from vanilla express:

```ts
import express from 'express';

const app = express();

app.get('/test', (req, res) => ...); // `/test` is the path // [!code focus]
```

### `method` - Method of the request

This property sets the method of the request.

**Available methods:** `get`, `post`, `put`, `patch` and `delete`.

```ts
import express from 'express';

const app = express();

app.get(...);
app.post(...);
app.put(...);
app.patch(...);
app.delete(...);
```

### `middlewares` - Array of middlewares that you want to use.

You can add your middlewares that you want to run to this array. Example from vanilla express:

```ts
import express, { RequestHandler, Router } from 'express';

const app = express();
const router = new Router();

// This is your middleware and you can add this to `middlewares` array.
// Example: `middlewares: [middleware]`
const middleware: RequestHandler = (req, res, next) => {
    console.log('Middleware triggered');
    next();
};

app.get('/myPath', middleware, (req, res) => ...);
```

## Creating a Route

You need a [Controller](./controller.md), in order to create a route.

### Basic Example

::: code-group

```ts [routes/users.ts]
import { Controller, Route } from '@burakbey/express-class-router';

@Controller({
    path: '/users'
})
export default class UserController {
    @Route({
        path: '/',
        method: 'get'
    })
    async getUsers() {
        ...
    }
}
```

:::

### With Middlewares

`CheckAuth` middleware will only be called on `getUser` method, **not all routes**.

::: code-group

```ts [routes/users.ts]
import { Controller, Route } from '@burakbey/express-class-router';
import { CheckAuth } from '../middlewares/CheckAuth';

@Controller({
    path: '/users',
    middlewares: [CheckAuth]
})
export default class UserController {
    @Route({
        path: '/',
        method: 'get',
        middlewares: [CheckAuth]
    })
    async getUsers() {
        ...
    }
}
```

:::
