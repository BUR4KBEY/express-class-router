# Automatic Loader

As this documentation mentioned before, this library loads all the routes under the `routes` folder.

## How it works?

When you call the `registerRoutes` function, it immediately scans your `routes` folder and finds all the files that end with `.js` or `.ts`.

After that, it simply imports the files and registers them to your express instance (`app`).

## Turn off the outputs

The library logs all the registered routes by default. However, if you want to disable this feature, you can add `disableConsoleOutputs: true` to your `registerRoutes` function.

```ts
...
await registerRoutes(
    ...
    disableConsoleOutputs: true // [!code focus]
)
...
```
