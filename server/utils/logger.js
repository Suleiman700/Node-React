const fs = require('fs').promises;
const path = require('path');
const dayjs = require('dayjs');

class Logger {
    static async logWebhook(req, status, error = null) {
        try {
            const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
            const date = dayjs().format('YYYY-MM-DD');
            
            // Create logs directory if it doesn't exist
            const logsDir = path.join(__dirname, '../logs');
            await fs.mkdir(logsDir, { recursive: true });

            // Create log entry
            const logEntry = {
                status,
                timestamp,
                ip: req.ip || req.connection.remoteAddress,
                method: req.method,
                url: req.originalUrl,
                headers: req.headers,
                body: req.body,
                params: req.params,
                query: req.query,
                error: error ? {
                    message: error.message,
                    stack: error.stack
                } : null
            };

            // Create the log file name with date
            const logFile = path.join(logsDir, `webhook-${date}.log`);

            // Append log entry to file
            await fs.appendFile(
                logFile,
                JSON.stringify(logEntry) + '\n',
                'utf8'
            );

            return true;
        } catch (err) {
            console.error('Error writing to log file:', err);
            return false;
        }
    }
}

module.exports = Logger;
