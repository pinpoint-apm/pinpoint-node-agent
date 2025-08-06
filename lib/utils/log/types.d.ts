/**
 * Pinpoint Node.js Agent
 * Copyright 2022-present NAVER Corp.
 * Apache License v2.0
 */

export declare enum LogLevel {
    TRACE = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    SILENT = 5
}

export declare interface Appender {
    loggingLevel: LogLevel | number;
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
    constructor(name: string, level: LogLevel | number);

    getName(): string;
    getLevel(): LogLevel | number;
    getAppenders(): Array<Appender>;
}

export declare class Logger {
    debug(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;

    isDebug(): boolean;
    isInfo(): boolean;

    getLogger(log: Log): Logger;
}
