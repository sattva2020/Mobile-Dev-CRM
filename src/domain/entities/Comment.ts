/**
 * Comment - Rich Domain Entity для комментариев
 * Содержит бизнес-логику для управления комментариями
 * Следует принципам Clean Architecture
 */
export class Comment {
  private constructor(
    private readonly id: string,
    private content: string,
    private author: string,
    private taskId: string,
    private parentId: string | null,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private reactions: Map<string, number> = new Map(),
    private resolved: boolean = false,
    private resolvedBy: string | null = null,
    private resolvedAt: Date | null = null
  ) {
    this.validateInvariants();
  }

  // Factory methods
  static create(
    content: string,
    author: string,
    taskId: string,
    parentId?: string
  ): Comment {
    const now = new Date();
    return new Comment(
      this.generateId(),
      content,
      author,
      taskId,
      parentId || null,
      now,
      now
    );
  }

  static fromPersistence(data: {
    id: string;
    content: string;
    author: string;
    taskId: string;
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
    reactions: Record<string, number>;
    resolved: boolean;
    resolvedBy: string | null;
    resolvedAt: string | null;
  }): Comment {
    const comment = new Comment(
      data.id,
      data.content,
      data.author,
      data.taskId,
      data.parentId,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    );
    
    comment.reactions = new Map(Object.entries(data.reactions));
    comment.resolved = data.resolved;
    comment.resolvedBy = data.resolvedBy;
    comment.resolvedAt = data.resolvedAt ? new Date(data.resolvedAt) : null;
    
    return comment;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getContent(): string {
    return this.content;
  }

  getAuthor(): string {
    return this.author;
  }

  getTaskId(): string {
    return this.taskId;
  }

  getParentId(): string | null {
    return this.parentId;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getReactions(): Map<string, number> {
    return new Map(this.reactions);
  }

  isResolved(): boolean {
    return this.resolved;
  }

  getResolvedBy(): string | null {
    return this.resolvedBy;
  }

  getResolvedAt(): Date | null {
    return this.resolvedAt;
  }

  // Business methods
  updateContent(content: string, author: string): void {
    if (!content || content.trim().length === 0) {
      throw new Error('Comment content cannot be empty');
    }
    if (content.length > 1000) {
      throw new Error('Comment content cannot exceed 1000 characters');
    }
    if (author !== this.author) {
      throw new Error('Only the author can update the comment');
    }
    
    this.content = content.trim();
    this.updatedAt = new Date();
  }

  addReaction(reaction: string, userId: string): void {
    if (!reaction || reaction.trim().length === 0) {
      throw new Error('Reaction cannot be empty');
    }
    if (reaction.length > 10) {
      throw new Error('Reaction cannot exceed 10 characters');
    }
    
    const currentCount = this.reactions.get(reaction) || 0;
    this.reactions.set(reaction, currentCount + 1);
    this.updatedAt = new Date();
  }

  removeReaction(reaction: string, userId: string): void {
    const currentCount = this.reactions.get(reaction) || 0;
    if (currentCount > 0) {
      this.reactions.set(reaction, currentCount - 1);
      if (this.reactions.get(reaction) === 0) {
        this.reactions.delete(reaction);
      }
      this.updatedAt = new Date();
    }
  }

  resolve(resolvedBy: string): void {
    if (this.resolved) {
      throw new Error('Comment is already resolved');
    }
    
    this.resolved = true;
    this.resolvedBy = resolvedBy;
    this.resolvedAt = new Date();
    this.updatedAt = new Date();
  }

  unresolve(): void {
    if (!this.resolved) {
      throw new Error('Comment is not resolved');
    }
    
    this.resolved = false;
    this.resolvedBy = null;
    this.resolvedAt = null;
    this.updatedAt = new Date();
  }

  // Business rules
  isReply(): boolean {
    return this.parentId !== null;
  }

  isRoot(): boolean {
    return this.parentId === null;
  }

  getReactionCount(): number {
    return Array.from(this.reactions.values()).reduce((sum, count) => sum + count, 0);
  }

  getReactionCountFor(reaction: string): number {
    return this.reactions.get(reaction) || 0;
  }

  hasReaction(reaction: string): boolean {
    return this.reactions.has(reaction) && this.reactions.get(reaction)! > 0;
  }

  getPopularReactions(): Array<{ reaction: string; count: number }> {
    return Array.from(this.reactions.entries())
      .map(([reaction, count]) => ({ reaction, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  getAgeInMinutes(): number {
    const now = new Date();
    return Math.floor((now.getTime() - this.createdAt.getTime()) / (1000 * 60));
  }

  getAgeInHours(): number {
    return Math.floor(this.getAgeInMinutes() / 60);
  }

  getAgeInDays(): number {
    return Math.floor(this.getAgeInHours() / 24);
  }

  isRecent(): boolean {
    return this.getAgeInMinutes() < 60;
  }

  isOld(): boolean {
    return this.getAgeInDays() > 30;
  }

  // Validation
  private validateInvariants(): void {
    if (!this.content || this.content.trim().length === 0) {
      throw new Error('Comment content cannot be empty');
    }
    if (this.content.length > 1000) {
      throw new Error('Comment content cannot exceed 1000 characters');
    }
    if (!this.author || this.author.trim().length === 0) {
      throw new Error('Comment author cannot be empty');
    }
    if (!this.taskId || this.taskId.trim().length === 0) {
      throw new Error('Comment taskId cannot be empty');
    }
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
    content: string;
    author: string;
    taskId: string;
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
    reactions: Record<string, number>;
    resolved: boolean;
    resolvedBy: string | null;
    resolvedAt: string | null;
  } {
    return {
      id: this.id,
      content: this.content,
      author: this.author,
      taskId: this.taskId,
      parentId: this.parentId,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      reactions: Object.fromEntries(this.reactions),
      resolved: this.resolved,
      resolvedBy: this.resolvedBy,
      resolvedAt: this.resolvedAt?.toISOString() || null
    };
  }
}
