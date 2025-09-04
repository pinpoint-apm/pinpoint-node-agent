/**
 * Pinpoint Node.js Agent
 * Copyright 2022-present NAVER Corp.
 * Apache License v2.0
 */

export declare class LogLevel {
    static readonly TRACE: 0;
    static readonly DEBUG: 1;
    static readonly INFO: 2;
    static readonly WARN: 3;
    static readonly ERROR: 4;
    static readonly SILENT: 5;
}

export declare type LogLevelNumbers = 0 | 1 | 2 | 3 | 4 | 5;

export declare interface Appender {
    name: string;
    loggingLevel: LogLevelNumbers | number;
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
}

export declare class LogBuilder {
    constructor(name?: string);

    logLevelDebug(): LogBuilder;
    logLevelInfo(): LogBuilder;
    logLevelWarn(): LogBuilder;
    logLevelError(): LogBuilder;
    logLevelSilent(): LogBuilder;

    addAppender(appender: Appender): LogBuilder;

    build(): Log;

    static LogLevel: typeof LogLevel;
}

export declare class Log {
    constructor(name: string, level: LogLevelNumbers | number);

    getName(): string;
    getLevel(): LogLevelNumbers | number;
    getAppenders(): Array<Appender>;
}

export declare interface Logging {
    debug(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;

    isDebug(): boolean;
    isInfo(): boolean;
}

export declare class Logger implements Logging {

    debug(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;

    isDebug(): boolean;
    isInfo(): boolean;

    getLogger(log: Log): Logger;
}

export declare class ChildLogger implements Logging {
    name: string;

    debug(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;

    isDebug(): boolean;
    isInfo(): boolean;
}

export declare const logger: Logger;

