/**
 * 커스텀 에러 클래스 및 에러 핸들링 미들웨어
 */

class WatchfaceError extends Error {
  constructor(message, code = 'WATCHFACE_ERROR', statusCode = 500) {
    super(message);
    this.name = 'WatchfaceError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

class ValidationError extends WatchfaceError {
  constructor(message, field = null) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class NotFoundError extends WatchfaceError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

/**
 * 에러 핸들링 미들웨어
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', {
    message: err.message,
    code: err.code,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString(),
  };
  
  if (err.field) {
    response.field = err.field;
  }
  
  res.status(statusCode).json(response);
}

/**
 * 404 핸들러
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  WatchfaceError,
  ValidationError,
  NotFoundError,
  errorHandler,
  notFoundHandler,
};
