# Decorators - Controller

`@Controller` is a main decorator for your controller class. It defines your class as **controller** and lets you configure the routes.

## Controller Options

### `path` - The main path of your routes.

This property sets where your routes will be requested. Example from vanilla express:

```ts
import express, { Router } from 'express';

const app = express();

const router = new Router();
router.get('/', (req, res) => ...);

app.use('/test', router); // `/test` is the path // [!code focus]
```

### `middlewares` - Array of middlewares that you want to use.

You can add your middlewares that you want to **run at all routes of the controller** to this array. Example from vanilla express:

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

app.use('/myPath', middleware, router);
```

## Creating a Controller

`Controller` is a `Router` from **vanilla express** basically and you need to create a controller to run your routes.

### Basic Example

::: code-group

```ts [routes/users.ts]
import { Controller } from '@burakbey/express-class-router';

@Controller({
    path: '/users'
})
export default class UserController {
    ...
}
```

:::

### With Middlewares

`CheckAuth` middleware will be called on all routes.

::: code-group

```ts [routes/users.ts]
import { Controller } from '@burakbey/express-class-router';
import { CheckAuth } from '../middlewares/CheckAuth';

@Controller({
    path: '/users',
    middlewares: [CheckAuth]
})
export default class UserController {
    ...
}
```

:::

## Important Rules About Controllers

-   Controller class must exported as default.

::: code-group

```ts [Good]
import { Controller } from '@burakbey/express-class-router';

@Controller({
    path: '/users'
})
export default class UserController {
    ...
}
```

```ts [Bad]
import { Controller } from '@burakbey/express-class-router';

@Controller({
    path: '/users'
})
export class UserController {
    ...
}
```

:::

-   All controllers must have at least one route.

::: code-group

```ts [Good]
import { Controller } from '@burakbey/express-class-router';
import { Request, Response } from 'express';

@Controller({
    path: '/users'
})
export default class UserController {
    @Route({
        path: '/',
        method: 'get'
    })
    async getUsers(req: Request, res: Response) {
        ...
    }
}
```

```ts [Bad]
import { Controller } from '@burakbey/express-class-router';

@Controller({
    path: '/users'
})
export class UserController {
    randomFunction() {
        // This function is not a route because
        // you have to use `@Route` decorator
    }
}
```

:::
