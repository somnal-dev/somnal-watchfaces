/**
 * 구조화된 로깅 시스템
 */

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL?.toLowerCase()] ?? LOG_LEVELS.info;

function formatLog(level, message, meta = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    service: 'somnal-watchfaces',
    ...meta,
  };
  
  if (process.env.NODE_ENV !== 'production') {
    const levelEmoji = { debug: '🔍', info: 'ℹ️', warn: '⚠️', error: '❌' };
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `${levelEmoji[level] || ''} [${logEntry.timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
  }
  
  return JSON.stringify(logEntry);
}

class Logger {
  constructor(context = 'app') {
    this.context = context;
  }

  _log(level, message, meta = {}) {
    if (LOG_LEVELS[level] < CURRENT_LEVEL) return;
    
    const formatted = formatLog(level, message, { context: this.context, ...meta });
    const output = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    output(formatted);
  }

  debug(message, meta = {}) { this._log('debug', message, meta); }
  info(message, meta = {}) { this._log('info', message, meta); }
  warn(message, meta = {}) { this._log('warn', message, meta); }
  error(message, meta = {}) { this._log('error', message, meta); }
  
  request(req, meta = {}) {
    this._log('info', `${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
      ...meta,
    });
  }
}

const logger = new Logger('app');

module.exports = { Logger, logger, LOG_LEVELS };
