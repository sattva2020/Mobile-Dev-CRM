/**
 * Logger - Централизованная система логирования
 * Поддерживает различные уровни логирования и отправку в внешние системы
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  service: string;
  requestId?: string;
  userId?: string;
  metadata?: Record<string, any>;
  stack?: string;
}

export interface LoggerConfig {
  service: string;
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  batchSize?: number;
  flushInterval?: number;
}

export class Logger {
  private config: LoggerConfig;
  private logBuffer: LogEntry[] = [];
  private flushTimer?: NodeJS.Timeout;

  constructor(config: LoggerConfig) {
    this.config = config;
    
    if (this.config.enableRemote && this.config.remoteEndpoint) {
      this.startFlushTimer();
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR, LogLevel.FATAL];
    const currentLevelIndex = levels.indexOf(this.config.level);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex >= currentLevelIndex;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    metadata?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.config.service,
      metadata,
      stack: error?.stack
    };
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry = this.createLogEntry(level, message, metadata, error);

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // Remote logging
    if (this.config.enableRemote) {
      this.logBuffer.push(entry);
      
      if (this.logBuffer.length >= (this.config.batchSize || 10)) {
        this.flushLogs();
      }
    }
  }

  private logToConsole(entry: LogEntry): void {
    const { timestamp, level, message, service, metadata, stack } = entry;
    const logMessage = `[${timestamp}] ${level.toUpperCase()} [${service}]: ${message}`;
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, metadata);
        break;
      case LogLevel.INFO:
        console.info(logMessage, metadata);
        break;
      case LogLevel.WARN:
        console.warn(logMessage, metadata);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(logMessage, metadata, stack);
        break;
    }
  }

  private async flushLogs(): Promise<void> {
    if (this.logBuffer.length === 0 || !this.config.remoteEndpoint) {
      return;
    }

    const logsToSend = [...this.logBuffer];
    this.logBuffer = [];

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logsToSend),
      });
    } catch (error) {
      console.error('Failed to send logs to remote endpoint:', error);
      // Re-add logs to buffer for retry
      this.logBuffer.unshift(...logsToSend);
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flushLogs();
    }, this.config.flushInterval || 5000);
  }

  public debug(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  public info(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  public warn(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  public error(message: string, metadata?: Record<string, any>, error?: Error): void {
    this.log(LogLevel.ERROR, message, metadata, error);
  }

  public fatal(message: string, metadata?: Record<string, any>, error?: Error): void {
    this.log(LogLevel.FATAL, message, metadata, error);
  }

  public setRequestId(requestId: string): void {
    // Add request ID to all subsequent logs
    this.logBuffer.forEach(log => log.requestId = requestId);
  }

  public setUserId(userId: string): void {
    // Add user ID to all subsequent logs
    this.logBuffer.forEach(log => log.userId = userId);
  }

  public async flush(): Promise<void> {
    await this.flushLogs();
  }

  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushLogs();
  }
}

// Глобальные экземпляры логгеров
export const appLogger = new Logger({
  service: 'crm-app',
  level: LogLevel.INFO,
  enableConsole: true,
  enableRemote: process.env.NODE_ENV === 'production',
  remoteEndpoint: process.env.LOG_ENDPOINT,
  batchSize: 10,
  flushInterval: 5000
});

export const apiLogger = new Logger({
  service: 'crm-api',
  level: LogLevel.INFO,
  enableConsole: true,
  enableRemote: process.env.NODE_ENV === 'production',
  remoteEndpoint: process.env.LOG_ENDPOINT,
  batchSize: 10,
  flushInterval: 5000
});

export const dbLogger = new Logger({
  service: 'crm-database',
  level: LogLevel.WARN,
  enableConsole: true,
  enableRemote: process.env.NODE_ENV === 'production',
  remoteEndpoint: process.env.LOG_ENDPOINT,
  batchSize: 10,
  flushInterval: 5000
});
