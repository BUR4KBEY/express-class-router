import chalk from 'chalk';

type LogLevel = 'log' | 'error';

export default class Logger {
    /**
     * Returns available color for log level
     * @param logLevel Log Level
     */
    private getColor(logLevel: LogLevel) {
        switch (logLevel) {
            case 'error':
                return chalk.red;
            default:
                return chalk.green;
        }
    }

    /**
     * Prints the message
     * @param message Message
     * @param logLevel Log Level
     * @param output Output
     */
    private printMessage(
        message: string,
        logLevel: LogLevel = 'log',
        output: 'stdout' | 'stderr' = 'stdout'
    ) {
        const color = this.getColor(logLevel);

        const contextMessage = chalk.cyan(`[${this.context}]`);
        const logLevelMessage = color(
            logLevel.toLocaleUpperCase().padStart(5, ' ')
        );

        // prettier-ignore
        let computedMessage = `${logLevelMessage} ${contextMessage} ${color(message)}`;
        computedMessage += '\n';

        process[output].write(computedMessage);
    }

    /**
     * Prints the error stack
     * @param stack Error stack
     */
    private printStack(stack?: string) {
        if (!stack) return;
        process.stderr.write(`${stack}\n`);
    }

    /** Creates the logger */
    constructor(/** Context of the object */ readonly context: string) {}

    /**
     * Logs message
     * @param message Message
     */
    log(message: string) {
        this.printMessage(message);
    }

    /**
     * Logs error
     * @param object Error object or string message
     */
    // eslint-disable-next-line
    error(object: any) {
        if (!(object instanceof Error) && typeof object !== 'string') return;

        this.printMessage(
            object instanceof Error ? object.message : object,
            'error',
            'stderr'
        );

        if (object instanceof Error) this.printStack(object.stack);
    }
}
