# Using Metadata

This documentation does not recommend to change any metadata. However, if you want to do this, you are in the right place.

## Metadata Strings

| String                         | Description                                                   |
| ------------------------------ | ------------------------------------------------------------- |
| `__ecr__controller__options__` | Used for setting `path` and `middlewares` for the controller. |
| `__ecr__controller__routes__`  | Used for setting the routes for the controller.               |

### Type of `__ecr__controller__options__`

```ts
interface ControllerOptions {
    path: string;
    middlewares?: RequestHandler[];
}
```

### Type of `__ecr__controller__routes__`

This is an array for routes.

```ts
interface RouteOptions {
    methodName: string;
    method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    path: string;
    middlewares?: RequestHandler[];
}
```

`methodName` is required for calling the correct function on the `registerRoutes` function because the library creates instances from the controller classes.

## Reaching the metadata

You need `reflect-metadata` package.

::: details
yarn add reflect-metadata
:::

You can use the code below to reach the metadata:

```ts
import 'reflect-metadata';

const metadata = Reflect.getMetadata('metadata_string_here', target);
```

The important thing is that the target must be the class itself, **not the instance**. For example:

```ts
import 'reflect-metadata';
import { Controller } from '@burakbey/express-class-router';

@Controller({
    path: '/test'
})
class TestController {}

const metadata = Reflect.getMetadata(
    '__ecr__controller__options__',
    TestController
);
```

## Changing the metadata

You can use the code below to reach the metadata:

```ts
import 'reflect-metadata';

Reflect.defineMetadata('metadata_string_here', value, target);
```

Again, the target must be the class itself, **not the instance**. For example:

```ts
import 'reflect-metadata';
import { Controller } from '@burakbey/express-class-router';

@Controller({
    path: '/test'
})
class TestController {}

Reflect.defineMetadata(
    '__ecr__controller__options__',
    { path: '/new-test' },
    TestController
);
```
