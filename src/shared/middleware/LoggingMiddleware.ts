import { Request, Response, NextFunction } from 'express';
import { appLogger, apiLogger } from '../services/Logger';
import { metricsCollector } from '../services/Metrics';

/**
 * Middleware для логирования HTTP запросов
 */
export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const requestId = generateRequestId();
  
  // Добавляем requestId к запросу
  req.requestId = requestId;
  
  // Логируем начало запроса
  apiLogger.info('HTTP request started', {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    requestId
  });

  // Перехватываем ответ
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    
    // Логируем завершение запроса
    apiLogger.info('HTTP request completed', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      requestId
    });

    // Записываем метрики
    metricsCollector.recordHttpRequest(
      req.method,
      req.url,
      res.statusCode,
      duration
    );

    // Вызываем оригинальный send
    return originalSend.call(this, data);
  };

  next();
};

/**
 * Middleware для обработки ошибок
 */
export const errorLoggingMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = req.requestId || 'unknown';
  
  // Логируем ошибку
  apiLogger.error('HTTP request error', {
    method: req.method,
    url: req.url,
    error: error.message,
    stack: error.stack,
    requestId
  }, error);

  // Записываем метрики ошибки
  metricsCollector.incrementCounter('http_errors_total', {
    method: req.method,
    url: req.url,
    error: error.name
  });

  // Отправляем ответ об ошибке
  res.status(500).json({
    error: 'Internal Server Error',
    requestId,
    timestamp: new Date().toISOString()
  });
};

/**
 * Middleware для аутентификации
 */
export const authLoggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  
  if (authHeader) {
    apiLogger.info('Authentication attempt', {
      method: req.method,
      url: req.url,
      hasAuth: true,
      requestId: req.requestId
    });
  }

  next();
};

/**
 * Middleware для бизнес-логики
 */
export const businessLoggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Логируем бизнес-операции
  if (req.url.includes('/tasks')) {
    apiLogger.info('Task operation', {
      method: req.method,
      url: req.url,
      requestId: req.requestId
    });
  }

  if (req.url.includes('/projects')) {
    apiLogger.info('Project operation', {
      method: req.method,
      url: req.url,
      requestId: req.requestId
    });
  }

  if (req.url.includes('/notifications')) {
    apiLogger.info('Notification operation', {
      method: req.method,
      url: req.url,
      requestId: req.requestId
    });
  }

  next();
};

/**
 * Middleware для производительности
 */
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = process.hrtime();
  
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const duration = seconds * 1000 + nanoseconds / 1000000;
    
    // Логируем медленные запросы
    if (duration > 1000) {
      apiLogger.warn('Slow request detected', {
        method: req.method,
        url: req.url,
        duration,
        requestId: req.requestId
      });
    }
  });

  next();
};

/**
 * Middleware для безопасности
 */
export const securityLoggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Проверяем подозрительную активность
  const userAgent = req.get('User-Agent');
  const ip = req.ip;
  
  // Логируем подозрительные запросы
  if (userAgent && (userAgent.includes('bot') || userAgent.includes('crawler'))) {
    apiLogger.warn('Bot request detected', {
      method: req.method,
      url: req.url,
      userAgent,
      ip,
      requestId: req.requestId
    });
  }

  // Логируем запросы с подозрительными параметрами
  if (req.url.includes('..') || req.url.includes('<script>')) {
    apiLogger.warn('Suspicious request detected', {
      method: req.method,
      url: req.url,
      ip,
      requestId: req.requestId
    });
  }

  next();
};

/**
 * Генерация уникального ID запроса
 */
function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Расширяем типы Express
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}
