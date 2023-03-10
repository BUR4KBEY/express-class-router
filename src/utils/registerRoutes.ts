import { Express, RequestHandler } from 'express';
import { lstatSync, readdirSync } from 'fs';
import { join } from 'path';

import {
    ControllerOptions,
    DecoratorMetadata,
    RouteOptions
} from '../decorators';
import Logger from './Logger';

type Constructor = new (...args: any[]) => any;

interface RegisterOptions {
    app: Express;
    folderPath: string;
    disableConsoleOutputs?: boolean;
}

function getFiles(initialPath: string): string[] {
    const files: string[] = [];
    const paths = readdirSync(initialPath);

    for (let path of paths) {
        path = join(initialPath, path);

        if (path.endsWith('.ts') || path.endsWith('.js')) {
            files.push(path);
        } else if (lstatSync(path).isDirectory()) {
            const filesInFolder = getFiles(path);
            files.push(...filesInFolder);
        }
    }

    return files;
}

class CustomError extends Error {
    constructor(message: string, public file: string) {
        super(message);
        this.name = 'CustomError';
    }
}

export default async function registerRoutes(options: RegisterOptions) {
    const files = getFiles(options.folderPath);

    for (const file of files) {
        try {
            const { default: defaultExport }: { default: Constructor } =
                await import(file);

            if (!defaultExport)
                throw new CustomError(
                    'No default export found. Please export your controller class as default.',
                    file
                );

            if (!(defaultExport instanceof Function))
                throw new CustomError('Default export is not a class.', file);

            const controllerOptions = Reflect.getMetadata(
                DecoratorMetadata.ControllerOptions,
                defaultExport
            ) as ControllerOptions | undefined;

            if (!controllerOptions)
                throw new CustomError(
                    `Please use '@Controller' decorator to set your class as a controller.`,
                    file
                );

            const controllerRoutes = (Reflect.getMetadata(
                DecoratorMetadata.ControllerRoutes,
                defaultExport
            ) || []) as RouteOptions[];

            if (!controllerRoutes.length)
                throw new CustomError(
                    `No routes found. Please use '@Route' decorator to add new routes.`,
                    file
                );

            const instance = new defaultExport();

            for (const route of controllerRoutes) {
                const fullPath = `${controllerOptions.path}${
                    route.path === '/' ? '' : route.path
                }`;
                const fn = instance[route.methodName];

                const args: RequestHandler[] = [];

                if (controllerOptions.middlewares?.length)
                    args.push(...controllerOptions.middlewares);
                if (route.middlewares?.length) args.push(...route.middlewares);

                args.push(fn.bind(instance));

                options.app[route.method](fullPath, ...args);

                if (options.disableConsoleOutputs !== true) {
                    const logger = new Logger(defaultExport.name);
                    logger.log(`${route.method.toUpperCase()} ${fullPath}`);
                }
            }
        } catch (error) {
            if (
                error instanceof CustomError &&
                options.disableConsoleOutputs !== true
            ) {
                const pathArray = error.file.split('\\');
                pathArray.splice(0, options.folderPath.split('\\').length - 1);
                const pathStr = pathArray.join('\\');

                const tempLogger = new Logger(pathStr);
                tempLogger.error(error.message);
            } else throw error;
        }
    }
}
