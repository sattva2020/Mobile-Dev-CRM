/**
 * User - Rich Domain Entity
 * Содержит бизнес-логику для управления пользователями
 * Следует принципам Clean Architecture
 */
export class User {
  private constructor(
    private readonly id: string,
    private email: string,
    private name: string,
    private avatar: string | null,
    private role: UserRole,
    private preferences: UserPreferences,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private lastLogin: Date | null = null
  ) {
    this.validateInvariants();
  }

  // Factory methods
  static create(
    email: string,
    name: string,
    role: UserRole = UserRole.DEVELOPER,
    preferences?: Partial<UserPreferences>
  ): User {
    const now = new Date();
    return new User(
      this.generateId(),
      email,
      name,
      null,
      role,
      {
        theme: 'light',
        language: 'ru',
        notifications: true,
        ...preferences
      },
      now,
      now
    );
  }

  static fromPersistence(data: {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    role: string;
    preferences: any;
    createdAt: string;
    updatedAt: string;
    lastLogin: string | null;
  }): User {
    return new User(
      data.id,
      data.email,
      data.name,
      data.avatar,
      data.role as UserRole,
      data.preferences,
      new Date(data.createdAt),
      new Date(data.updatedAt),
      data.lastLogin ? new Date(data.lastLogin) : null
    );
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getName(): string {
    return this.name;
  }

  getAvatar(): string | null {
    return this.avatar;
  }

  getRole(): UserRole {
    return this.role;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getLastLogin(): Date | null {
    return this.lastLogin;
  }

  // Business methods
  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('User name cannot be empty');
    }
    this.name = name.trim();
    this.updatedAt = new Date();
  }

  updateEmail(email: string): void {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    this.email = email.toLowerCase();
    this.updatedAt = new Date();
  }

  updateAvatar(avatar: string | null): void {
    this.avatar = avatar;
    this.updatedAt = new Date();
  }

  updateRole(role: UserRole): void {
    this.role = role;
    this.updatedAt = new Date();
  }

  updatePreferences(preferences: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...preferences };
    this.updatedAt = new Date();
  }

  updateTheme(theme: 'light' | 'dark'): void {
    this.preferences.theme = theme;
    this.updatedAt = new Date();
  }

  updateLanguage(language: 'ru' | 'en'): void {
    this.preferences.language = language;
    this.updatedAt = new Date();
  }

  updateNotifications(enabled: boolean): void {
    this.preferences.notifications = enabled;
    this.updatedAt = new Date();
  }

  recordLogin(): void {
    this.lastLogin = new Date();
    this.updatedAt = new Date();
  }

  // Business rules
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isManager(): boolean {
    return this.role === UserRole.MANAGER;
  }

  isDeveloper(): boolean {
    return this.role === UserRole.DEVELOPER;
  }

  isViewer(): boolean {
    return this.role === UserRole.VIEWER;
  }

  canManageUsers(): boolean {
    return this.isAdmin() || this.isManager();
  }

  canManageProjects(): boolean {
    return this.isAdmin() || this.isManager() || this.isDeveloper();
  }

  canViewReports(): boolean {
    return this.isAdmin() || this.isManager();
  }

  canEditTasks(): boolean {
    return this.isAdmin() || this.isManager() || this.isDeveloper();
  }

  canViewTasks(): boolean {
    return true; // Все роли могут просматривать задачи
  }

  isActive(): boolean {
    if (!this.lastLogin) {
      return false;
    }
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.lastLogin > thirtyDaysAgo;
  }

  isInactive(): boolean {
    return !this.isActive();
  }

  getDaysSinceLastLogin(): number {
    if (!this.lastLogin) {
      return -1; // Никогда не входил
    }
    const now = new Date();
    return Math.floor((now.getTime() - this.lastLogin.getTime()) / (1000 * 60 * 60 * 24));
  }

  getDaysSinceRegistration(): number {
    const now = new Date();
    return Math.floor((now.getTime() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Validation
  private validateInvariants(): void {
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error('Invalid email format');
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('User name cannot be empty');
    }
    if (!Object.values(UserRole).includes(this.role)) {
      throw new Error('Invalid user role');
    }
    if (!this.preferences.theme || !['light', 'dark'].includes(this.preferences.theme)) {
      throw new Error('Invalid theme preference');
    }
    if (!this.preferences.language || !['ru', 'en'].includes(this.preferences.language)) {
      throw new Error('Invalid language preference');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Persistence
  toPersistence(): {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    role: string;
    preferences: UserPreferences;
    createdAt: string;
    updatedAt: string;
    lastLogin: string | null;
  } {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      avatar: this.avatar,
      role: this.role,
      preferences: { ...this.preferences },
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      lastLogin: this.lastLogin?.toISOString() || null
    };
  }
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  DEVELOPER = 'developer',
  VIEWER = 'viewer'
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'ru' | 'en';
  notifications: boolean;
}
