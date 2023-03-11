# Validating Requests

In this example, we will use [**Joi**](https://www.npmjs.com/package/joi) package for validation.

## Installation

Firstly, install the validation package.

```ps
yarn add joi
```

Then, create `validations` and `middlewares` folders under the `src` folder.

## Creating middlewares

It is not a good idea to code every validation thing into your main route. Instead, you should create a middleware and pass the validation schema to it.

::: code-group

```ts [src/middlewares/validation.ts]
import { RequestHandler } from 'express';
import { AnySchema } from 'joi';

type Where = 'body' | 'query';

const createValidationMiddleware: (
    where: Where
) => (schema: AnySchema) => RequestHandler =
    where => schema => (req, res, next) => {
        const { error, value } = schema.validate(req[where]);

        if (error) {
            // 400: Bad Request
            res.status(400).json({
                success: false,
                message: error.message
            });
            return;
        }

        req[where] = value;
        next();
    };

export const validateBody = createValidationMiddleware('body');
export const validateQuery = createValidationMiddleware('query');
```

:::

## Validating the `body`

In this scenario, Users will register to our system using their `username`, `email`, `password` and optionally `age`.

Firstly, you need a route:

::: code-group

```ts [src/routes/auth.ts]
import { Request, Response } from 'express';

import { Controller, Route } from '@burakbey/express-class-router';

@Controller({
    path: '/auth'
})
export default class AuthController {
    @Route({
        method: 'post',
        path: '/register'
    })
    registerUser(req: Request, res: Response) {
        ...
    }
}
```

:::

Then, you need to create your schema to verify the incoming data from `body`.

::: code-group

```ts [src/validations/auth.ts]
import Joi from 'joi';

export const postUserSchema = Joi.object({
    username: Joi.string().required().trim(),
    password: Joi.string().required().trim(),
    email: Joi.string().required().trim().email(),
    age: Joi.number().min(18).max(100)
});
```

:::

`Joi.string` function forces the property must be a string.

`Joi.required` function forces the property must not `undefined`, `null` or empty.

`Joi.trim` function removes the empty spaces from the property.

`Joi.email` function forces the property must be a valid email address. (Regexp)

`Joi.number` function forces the property must be a number.

`Joi.min` and `Joi.max` function force the property's minimum and maximum values.

**Read [**Joi documentation**](https://joi.dev) for more information.**

---

After that, you need to validate the `body`. You should use `validateBody` middleware.

::: code-group

```ts [src/routes/auth.ts]
import { Request, Response } from 'express';

import { Controller, Route } from '@burakbey/express-class-router';

import { validateBody } from '../middlewares/validation'; // [!code ++]
import { postUserSchema } from '../validations/auth'; // [!code ++]

// [!code ++] interface User {
    username: string;  // [!code ++]
    password: string;  // [!code ++]
    email: string;  // [!code ++]
    age?: number;  // [!code ++]
}  // [!code ++]

@Controller({
    path: '/auth'
})
export default class AuthController {
    @Route({
        method: 'post',
        path: '/register',
        middlewares: [validateBody(postUserSchema)] // [!code ++]
    })
    registerUser(req: Request, res: Response) {
        const { username, email, password, age } = req.body as User; // [!code ++]

        console.log(`Username: ${username}`); // [!code ++]
        console.log(`Email: ${email}`); // [!code ++]
        console.log(`Password: ${password}`); // [!code ++]
        console.log(`Age: ${age ?? 'Age is not provided'}`);// [!code ++]

        res.json({ success: true }); // [!code ++]
    }
}
```

:::

The final step is to add `express.json()` to your Express application using the `app.use()` function. This middleware function is used to parse incoming request bodies and transform them into a JSON object, making it easier to work with the data in your code.

::: code-group

```ts [src/index.ts]
import express from 'express';
import { join } from 'path';

import { registerRoutes } from '@burakbey/express-class-router';

(async () => {
    const app = express();
    const PORT = 3000;

    app.use(express.json()); // [!code ++]

    await registerRoutes({
        app,
        folderPath: join(__dirname, './routes')
    });

    app.listen(PORT, () =>
        console.log(`Application is running on port ${PORT}`)
    );
})();
```

:::

Finally, you can test your api. Run `yarn start:dev` function to start the server.

You must send your requests to `/auth/register` with `POST` method. These are the some example body objects for successful response:

```json
{
    "username": "admin",
    "password": "pass",
    "email": "admin@company.com"
}
```

```json
{
    "username": "employee",
    "password": "super-secret-password",
    "email": "employee@company.com",
    "age": 27
}
```

## Validating the `query`

Template is the same. Create your own schema and use it with the correct validation function.

::: code-group

```ts [src/validators/auth.ts]
import Joi from 'joi';

...

export const getUserQuerySchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string(),
    age: Joi.number()
})
```

```ts [src/routes/auth.ts]
import { Request, Response } from 'express';

import { Controller, Route } from '@burakbey/express-class-router';

import { validateQuery } from '../middlewares/validation'; // [!code ++]
import { getUserQuerySchema } from '../validations/auth'; // [!code ++]

...

interface UserQuery { // [!code ++]
    username: string; // [!code ++]
    email?: string; // [!code ++]
    age?: number; // [!code ++]
} // [!code ++]

@Controller({
    path: '/auth'
})
export default class AuthController {
    @Route({
        method: 'get',
        path: '/',
        middlewares: [validateQuery(getUserQuerySchema)] // [!code ++]
    })
    getUser(req: Request<unknown, unknown, unknown, UserQuery>, res: Response) {
        const { username, age, email } = req.query; // [!code ++]

        console.log(`Username: ${username}`); // [!code ++]
        console.log(`Email: ${email ?? 'Email is not provided'}`); // [!code ++]
        console.log(`Age: ${age ?? 'Age is not provided'}`); // [!code ++]

        res.json({ success: true }); // [!code ++]
    }

    ...
}
```

:::
