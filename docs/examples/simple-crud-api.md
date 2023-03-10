# Examples - Simple CRUD API

## What is CRUD

`CRUD` is a shorthand for `Create`, `Read`, `Update`, and `Delete`.

## Standard methods for CRUD operations

You should:

-   Use `GET` method for retrieving data. For example:

    `GET /users` : **Lists all users**

    `GET /users/:userId` : **Gets the user**

-   Use `POST` method for creating a new resource.

    `POST /users` : **Creates a new user**

-   Use `DELETE` method for deleting a resource.

    `DELETE /users/:userId` : **Deletes a user**

-   Use `PATCH` or `PUT` methods for updating a resource.

    `PATCH /users/:userId` : **Updates the user**

## Before begin

This example is about understanding the library. It does not use any database. The responses are different from each other but you should make a response template for your own APIs. For example:

::: code-group

```json [Example Successful Response]
{
    "success": true,
    "message": "Ok",
    "data": [
        {
            ...
        },
        {
            ...
        }
    ]
}
```

```json [Example Error Response]
{
    "success": false,
    "message": "BadRequest"
}
```

:::

With this responses, we can say our response interface is like this:

```ts
interface Response<T> {
    success: boolean;
    message: string;
    data?: T;
}
```

For example:

```ts
import axios from 'axios';

interface Book {
    name: string;
}

async function fetchFromApi() {
    const response = await axios({
        method: 'GET',
        url: 'http://localhost:1111/books'
    });

    const incomingData = response.data as Response<Book[]>;

    if (incomingData.success && incomingData.data) {
        for (const book of incomingData.data) {
            console.log(book.name);
        }
    }
}
```

## The project

::: code-group

```ts [src/index.ts]
import { registerRoutes } from '@burakbey/express-class-router';
import { join } from 'path';
import express from 'express';

(async () => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    await registerRoutes({
        app,
        folderPath: join(__dirname, './routes')
    });

    app.listen(3000, () => console.log('Application running on port 3000'));
})();
```

```ts [src/routes/users.ts]
import { Controller, Route } from '@burakbey/express-class-router';
import { Request, Response } from 'express';

interface User {
    username: string;
    password: string;
}

@Controller({
    path: '/users'
})
export default class UserController {
    users: User[] = [];

    @Route({
        method: 'get',
        path: '/'
    })
    getAllUsers(req: Request, res: Response) {
        res.json({ users: this.users });
    }

    @Route({
        method: 'get',
        path: '/:username'
    })
    getUser(req: Request, res: Response) {
        const { username } = req.params;
        const user = this.users.find(user => user.username === username);

        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        res.json({ user });
    }

    @Route({
        method: 'delete',
        path: '/:username'
    })
    deleteUser(req: Request, res: Response) {
        const { username } = req.params;
        const userIndex = this.users.findIndex(
            user => user.username === username
        );

        if (userIndex === -1) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        this.users.splice(userIndex, 1);
        res.json({ message: 'User deleted.' });
    }

    @Route({
        method: 'post',
        path: '/'
    })
    addUser(req: Request, res: Response) {
        const { username, password } = req.body;
        const user: User = { username, password };

        this.users.push(user);

        res.json({ user });
    }

    @Route({
        method: 'patch',
        path: '/:username'
    })
    editUser(req: Request, res: Response) {
        const { username } = req.params;
        const user = this.users.find(user => user.username === username);

        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        const { password } = req.body;
        user.password = password;

        res.json({ user });
    }
}
```

:::

## Requests

### List users

Returns all users.

::: tip GET /users
:::

### Get a user

Returns the user.

::: tip GET /users/:username
:::

Parameters

| Parameter | Description          |
| --------- | -------------------- |
| username  | Username of the user |

### Delete a user

Deletes the user.

::: tip DELETE /users/:username
:::

Parameters

| Parameter | Description          |
| --------- | -------------------- |
| username  | Username of the user |

### Create a user

Creates a new user

::: warning POST /users
:::

Body

```json
{
    "username": "admin",
    "password": "pass"
}
```

### Edit a user

Edits the user

::: warning PATCH /users/:username
:::

Parameters

| Parameter | Description          |
| --------- | -------------------- |
| username  | Username of the user |

Body

```json
{
    "password": "newPassword"
}
```
