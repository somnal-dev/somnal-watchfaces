/**
 * 입력 검증 미들웨어
 */

const { ValidationError } = require('./errorHandler');

/**
 * 워치페이스 생성 요청 검증
 */
function validateWatchfaceGeneration(req, res, next) {
  const { templateId, name, colors } = req.body;
  
  if (!templateId || typeof templateId !== 'string') {
    throw new ValidationError('templateId is required', 'templateId');
  }
  
  if (name && (typeof name !== 'string' || name.length > 100)) {
    throw new ValidationError('Name must be a string with max 100 characters', 'name');
  }
  
  if (colors) {
    if (typeof colors !== 'object') {
      throw new ValidationError('Colors must be an object', 'colors');
    }
    
    // 색상 값 형식 검증 (hex, rgb, rgba)
    const colorPattern = /^(#([0-9A-Fa-f]{3}){1,2}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)|[a-zA-Z]+)$/;
    
    for (const [key, value] of Object.entries(colors)) {
      if (typeof value !== 'string' || !colorPattern.test(value)) {
        throw new ValidationError(`Invalid color format for ${key}`, `colors.${key}`);
      }
    }
  }
  
  next();
}

/**
 * ID 파라미터 검증
 */
function validateId(req, res, next) {
  const { id } = req.params;
  
  if (!id || typeof id !== 'string') {
    throw new ValidationError('Invalid ID', 'id');
  }
  
  // UUID 또는 간단한 ID 형식
  const idPattern = /^[a-zA-Z0-9_-]+$/;
  if (!idPattern.test(id)) {
    throw new ValidationError('ID contains invalid characters', 'id');
  }
  
  next();
}

module.exports = {
  validateWatchfaceGeneration,
  validateId,
};
