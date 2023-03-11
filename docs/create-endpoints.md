# Create Endpoints

## Before begin

I highly recommend reading about [**Controller**](/decorators/controller) and [**Route**](/decorators/route) decorators. It is essential to understand the library.

## Create a new endpoint

We must create our routes in our `routes` folder because the library will load all the routers from that folder automatically. File levels are not necessary. You can create your files in subfolders, for example:

```
src/
├─ routes/
│  ├─ admin/
│  │  ├─ users.ts
│  ├─ statistics.ts
│  ├─ auth.ts
├─ index.ts
```

All the `users.ts`, `statistics.ts` and `auth.ts` will be loaded automatically.

## Creating our first controller

Create a `users.ts` file in `routes` folder.

::: code-group

```ts{3-5} [routes/users.ts]
import { Controller } from '@burakbey/express-class-router';

@Controller({
    path: '/users'
})
export default class UserController {
    ...
}
```

:::

## Add a route to the controller

::: code-group

```ts{10-16} [routes/users.ts]
import { Controller, Route } from '@burakbey/express-class-router';
import { Request, Response } from 'express';

@Controller({
    path: '/users'
})
export default class UserController {
    users = [];

    @Route({
        method: 'get',
        path: '/'
    })
    getAllUsers(req: Request, res: Response) {
        res.json({ users: this.users });
    }
}
```

:::

If you run the application using the yarn start:dev command, you should see a message that tells you this endpoint is loaded, like this:

```
GET /users
```

And if you send a `GET` request to this endpoint, you should get a response like this:

```json
{
    "users": []
}
```

## The difference between vanilla express

You can see the difference between express and this library in this example clearly.

Vanilla Express:

::: code-group

```ts [src/index.ts]
import express from 'express';
import UsersRoute from './routes/users';

const app = express();
const PORT = 3000;

app.use('/users', UsersRoute);

app.listen(PORT, () => console.log(`Application is running on port ${PORT}`));
```

```ts [src/routes/users.ts]
import { Router } from 'express';

const router = Router();
const users = [];

router.get('/', (req, res) => {
    res.json({ users });
});

export default router;
```

:::

This Library:

::: code-group

```ts [src/index.ts]
import { registerRoutes } from '@burakbey/express-class-router';
import { join } from 'path';
import express from 'express';

(async () => {
    const app = express();
    const PORT = 3000;

    await registerRoutes({
        app,
        folderPath: join(__dirname, './routes')
    });

    app.listen(PORT, () =>
        console.log(`Application is running on port ${PORT}`)
    );
})();
```

```ts [src/routes/users.ts]
import { Controller, Route } from '@burakbey/express-class-router';
import { Request, Response } from 'express';

@Controller({
    path: '/users'
})
export default class UserController {
    users = [];

    @Route({
        method: 'get',
        path: '/'
    })
    getAllUsers(req: Request, res: Response) {
        res.json({ users: this.users });
    }
}
```

:::

## More examples

If you want to see more examples of the library, check the sidebar on the left.
