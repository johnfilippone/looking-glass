import winston from 'winston';

function getLogger() {
    return winston.createLogger({
        level: 'info',
        format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        defaultMeta: { service: 'looking-glass-graphql' },
        transports: [
            new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
            new winston.transports.File({ filename: 'logs/combined.log' }),
            new winston.transports.Console({ format: winston.format.simple() })
        ]
    });
}

export default getLogger;
