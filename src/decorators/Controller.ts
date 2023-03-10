import 'reflect-metadata';

import { RequestHandler } from 'express';

import { DecoratorMetadata } from './';

export interface ControllerOptions {
    path: string;
    middlewares?: RequestHandler[];
}

export const Controller: (options: ControllerOptions) => ClassDecorator =
    options => target => {
        // Set options
        Reflect.defineMetadata(
            DecoratorMetadata.ControllerOptions,
            options,
            target
        );
    };
