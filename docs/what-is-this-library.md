# What Is This Library?

This is a simple library that enables you to generate Express applications using class syntax.

## Benefits

-   The biggest benefit of this library is that it allows you to use decorators because of the class syntax.

-   Additionally, this library has its own automatic loader system, which avoids the need to use the `app.use` method for individual routes.

-   Optionally, this library logs all the endpoints at the start of the server. For example:

    ```
    GET /users
    GET /users/:userId
    DELETE /users/:userId
    POST /users
    PATCH /users/:userId
    ```
