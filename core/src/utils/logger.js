import path from 'path';
import { fileURLToPath } from 'url';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}][${level}] ${message}`;
});

const logger = createLogger({
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new transports.Console(), // 添加控制台输出
        new transports.File({
            filename: path.join(__dirname, '../../logger', `${new Date().toISOString().split('T')[0]}.log`),
            level: 'error'
        })
    ]
});

export default logger;