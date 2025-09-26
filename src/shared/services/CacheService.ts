/**
 * CacheService - Сервис для кэширования данных
 * Поддерживает различные стратегии кэширования и TTL
 */
export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size
  strategy?: 'lru' | 'fifo' | 'ttl'; // Cache eviction strategy
}

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

export class CacheService<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private options: Required<CacheOptions>;

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 300000, // 5 minutes default
      maxSize: options.maxSize || 1000,
      strategy: options.strategy || 'lru'
    };
  }

  public set(key: string, value: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.options.ttl,
      accessCount: 0,
      lastAccessed: Date.now()
    };

    // Check if cache is full
    if (this.cache.size >= this.options.maxSize) {
      this.evict();
    }

    this.cache.set(key, entry);
  }

  public get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();

    return entry.value;
  }

  public has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  public size(): number {
    return this.cache.size;
  }

  public keys(): string[] {
    return Array.from(this.cache.keys());
  }

  public values(): T[] {
    return Array.from(this.cache.values()).map(entry => entry.value);
  }

  public entries(): Array<[string, T]> {
    return Array.from(this.cache.entries()).map(([key, entry]) => [key, entry.value]);
  }

  public getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    averageAge: number;
    oldestEntry: number;
    newestEntry: number;
  } {
    const now = Date.now();
    const entries = Array.from(this.cache.values());
    
    if (entries.length === 0) {
      return {
        size: 0,
        maxSize: this.options.maxSize,
        hitRate: 0,
        averageAge: 0,
        oldestEntry: 0,
        newestEntry: 0
      };
    }

    const totalAccessCount = entries.reduce((sum, entry) => sum + entry.accessCount, 0);
    const hitRate = totalAccessCount > 0 ? entries.reduce((sum, entry) => sum + entry.accessCount, 0) / totalAccessCount : 0;
    
    const ages = entries.map(entry => now - entry.timestamp);
    const averageAge = ages.reduce((sum, age) => sum + age, 0) / ages.length;
    
    const oldestEntry = Math.max(...ages);
    const newestEntry = Math.min(...ages);

    return {
      size: this.cache.size,
      maxSize: this.options.maxSize,
      hitRate,
      averageAge,
      oldestEntry,
      newestEntry
    };
  }

  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private evict(): void {
    switch (this.options.strategy) {
      case 'lru':
        this.evictLRU();
        break;
      case 'fifo':
        this.evictFIFO();
        break;
      case 'ttl':
        this.evictTTL();
        break;
    }
  }

  private evictLRU(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private evictFIFO(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private evictTTL(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (this.isExpired(entry)) {
        expiredKeys.push(key);
      }
    }

    // If no expired entries, evict oldest
    if (expiredKeys.length === 0) {
      this.evictFIFO();
    } else {
      expiredKeys.forEach(key => this.cache.delete(key));
    }
  }
}

// Специализированные кэши для разных типов данных
export const taskCache = new CacheService({
  ttl: 300000, // 5 minutes
  maxSize: 100,
  strategy: 'lru'
});

export const projectCache = new CacheService({
  ttl: 600000, // 10 minutes
  maxSize: 50,
  strategy: 'lru'
});

export const userCache = new CacheService({
  ttl: 1800000, // 30 minutes
  maxSize: 200,
  strategy: 'lru'
});

export const notificationCache = new CacheService({
  ttl: 60000, // 1 minute
  maxSize: 500,
  strategy: 'fifo'
});

// Утилиты для работы с кэшем
export class CacheUtils {
  public static async getOrSet<T>(
    cache: CacheService<T>,
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = cache.get(key);
    
    if (cached !== null) {
      return cached;
    }

    const value = await fetcher();
    cache.set(key, value, ttl);
    
    return value;
  }

  public static invalidatePattern(
    cache: CacheService<any>,
    pattern: RegExp
  ): void {
    const keys = cache.keys();
    const matchingKeys = keys.filter(key => pattern.test(key));
    
    matchingKeys.forEach(key => cache.delete(key));
  }

  public static warmCache<T>(
    cache: CacheService<T>,
    data: Array<{ key: string; value: T }>
  ): void {
    data.forEach(({ key, value }) => {
      cache.set(key, value);
    });
  }
}
