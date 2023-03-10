# Installation

## Important Note

This documentation is based on [**TypeScript**](https://www.typescriptlang.org/) and [**yarn**](https://yarnpkg.com/).

## Installation Steps

Firstly, you need to create a new folder for your project.

::: details

::: code-group

```ps [Powershell]
mkdir my-project
cd my-project
```

:::

Then, you need to initialize `package.json` and install the required packages.

::: code-group

```ps [Powershell]
yarn init -y
yarn add express @burakbey/express-class-router path
yarn add typescript nodemon ts-node rimraf @types/express @types/node -D
```

:::

After that, create these files and folders:

-   `folder` src
-   `file` src/index.ts
-   `folder` src/routes

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

    app.listen(PORT, () => console.log(`Application running on port ${PORT}`));
})();
```

:::

Then, add this section to your `package.json` file.

```json
{
    ...
    "scripts": {
        "clean": "rimraf dist",
        "prebuild": "yarn clean",
        "build": "tsc -p .",
        "start:dev": "nodemon src/index.ts",
        "start:prod": "node dist/index.js"
    },
    ...
}
```

After that, run this command for creating `tsconfig.json` file.

```ps
yarn tsc --init
```

Then, add this lines to `tsconfig.json`:

```json
{
    "compilerOptions": {
        ...
        "outDir": "./dist",
        "rootDir": "./src",
        "moduleResolution": "node",
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
        ...
    }
}
```

**(Recommended)** If you want more strict rules, add these lines too:

::: details

```json
{
    "compilerOptions": {
        ...
        "noImplicitAny": true,
        "strictNullChecks": true,
        "strictFunctionTypes": true,
        "strictBindCallApply": true,
        "strictPropertyInitialization": false,
        "noImplicitThis": true,
        "alwaysStrict": true
        ...
    }
}
```

:::

Installation has been finished 🎉

## Scripts

-   `clean` : Deletes the `dist` folder.
-   `prebuild` : Runs the clean script automatically before the build script.
-   `build` : Builds the project and creates a build folder called `dist`.
-   `start:dev` : Runs the project on development mode and watches the files for changes.
-   `start:prod` : Runs the project on production mode. The project must be built before using this script.

You can run the scripts by executing `yarn <script name>`, for example: `yarn clean`.
