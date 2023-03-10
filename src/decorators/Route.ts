import { RequestHandler } from 'express';

import { DecoratorMetadata } from './';

export interface RouteOptions {
    methodName: string;
    method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    path: string;
    middlewares?: RequestHandler[];
}

export const Route: (
    options: Omit<RouteOptions, 'methodName'>
) => MethodDecorator = options => (target, key, descriptor) => {
    const routes = (Reflect.getMetadata(
        DecoratorMetadata.ControllerRoutes,
        target.constructor
    ) || []) as RouteOptions[];

    routes.push({
        ...options,
        methodName: key.toString()
    });

    Reflect.defineMetadata(
        DecoratorMetadata.ControllerRoutes,
        routes,
        target.constructor
    );
};
