import winston from 'winston';

const logLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5
    },
};

const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

export const devLogger = winston.createLogger({
    levels: logLevels.levels,
    format: logFormat,
    transports: [
        new winston.transports.Console({ level: 'debug' })
    ]
});

export const prodLogger = winston.createLogger({
    levels: logLevels.levels,
    format: logFormat,
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({ filename: './src/services/logs/errors.log', level: 'error' })
    ]
});