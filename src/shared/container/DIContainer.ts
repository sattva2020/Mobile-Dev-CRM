/**
 * DIContainer - Простой контейнер для Dependency Injection
 * Следует принципам Clean Architecture
 */
export class DIContainer {
  private services = new Map<string, any>();
  private factories = new Map<string, () => any>();

  /**
   * Регистрация сервиса как singleton
   */
  registerSingleton<T>(key: string, factory: () => T): void {
    this.factories.set(key, factory);
  }

  /**
   * Регистрация сервиса как transient (новый экземпляр каждый раз)
   */
  registerTransient<T>(key: string, factory: () => T): void {
    this.factories.set(key, factory);
  }

  /**
   * Регистрация готового экземпляра
   */
  registerInstance<T>(key: string, instance: T): void {
    this.services.set(key, instance);
  }

  /**
   * Получение сервиса
   */
  get<T>(key: string): T {
    // Проверяем, есть ли уже готовый экземпляр
    if (this.services.has(key)) {
      return this.services.get(key);
    }

    // Создаем новый экземпляр через фабрику
    const factory = this.factories.get(key);
    if (!factory) {
      throw new Error(`Service '${key}' not registered`);
    }

    const instance = factory();
    this.services.set(key, instance);
    return instance;
  }

  /**
   * Проверка регистрации сервиса
   */
  isRegistered(key: string): boolean {
    return this.services.has(key) || this.factories.has(key);
  }

  /**
   * Очистка всех сервисов
   */
  clear(): void {
    this.services.clear();
    this.factories.clear();
  }
}

// Глобальный экземпляр контейнера
export const container = new DIContainer();
