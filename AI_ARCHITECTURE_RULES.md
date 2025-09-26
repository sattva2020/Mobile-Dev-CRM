# 🏗️ Правила чистой архитектуры в эпоху AI-генерации кода

## 📋 **Проблема**
AI генерирует код без понимания архитектуры, что приводит к:
- Быстрой разработке, но потере контроля
- Добавление фичи ломает код в 3 местах
- Исправление бага создает 5 новых
- В итоге - переписывание с нуля

## 🎯 **Решение: Чистая архитектура для AI-эры**

### **1. Entity - Умные бизнес-объекты**

```typescript
// ❌ Плохо - анимичная модель
class User {
  id: string;
  name: string;
  balance: number;
  
  setBalance(amount: number) {
    this.balance = amount;
  }
}

// ✅ Хорошо - Rich модель с бизнес-логикой
class BankAccount {
  constructor(
    private id: string,
    private balance: number,
    private dailyLimit: number
  ) {}
  
  withdraw(amount: number): void {
    if (amount > this.balance) {
      throw new Error('Недостаточно средств');
    }
    if (amount > this.dailyLimit) {
      throw new Error('Превышен дневной лимит');
    }
    this.balance -= amount;
  }
}
```

### **2. Use Cases - Дирижеры оркестра**

```typescript
// ✅ Четкий сценарий для AI
class TransferMoneyUseCase {
  constructor(
    private userRepository: UserRepository,
    private accountRepository: AccountRepository
  ) {}
  
  async execute(fromUserId: string, toUserId: string, amount: number): Promise<void> {
    // 1. Получить пользователей
    const fromUser = await this.userRepository.findById(fromUserId);
    const toUser = await this.userRepository.findById(toUserId);
    
    // 2. Выполнить перевод через доменную логику
    fromUser.withdraw(amount);
    toUser.deposit(amount);
    
    // 3. Сохранить изменения
    await this.accountRepository.save(fromUser);
    await this.accountRepository.save(toUser);
  }
}
```

### **3. Границы и DTO**

```typescript
// ✅ Четкие контракты между слоями
interface CreateOrderRequest {
  productId: string;
  quantity: number;
  customerId: string;
}

interface CreateOrderResponse {
  orderId: string;
  totalPrice: number;
  status: string;
}
```

## 🎯 **Практические правила для AI-генерации**

### **Правило 1: Изоляция бизнес-логики**

```typescript
// ❌ AI не должен генерировать это
class UserController {
  async createUser(req: Request) {
    // Бизнес-логика в контроллере - плохо
    if (req.body.balance < 0) {
      throw new Error('Баланс не может быть отрицательным');
    }
    // ...
  }
}

// ✅ AI должен генерировать это
class UserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}
  
  async createUser(req: Request) {
    const dto = this.mapToDto(req.body);
    await this.createUserUseCase.execute(dto);
  }
}
```

### **Правило 2: Четкие границы ответственности**

```typescript
// ✅ Каждый слой знает свою роль
class OrderEntity {
  // Только бизнес-правила
  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
}

class CreateOrderUseCase {
  // Только оркестрация
  async execute(dto: CreateOrderDto): Promise<OrderEntity> {
    const order = new OrderEntity(dto.items);
    await this.orderRepository.save(order);
    return order;
  }
}
```

### **Правило 3: Тестируемость для AI**

```typescript
// ✅ AI может легко генерировать тесты
describe('TransferMoneyUseCase', () => {
  it('should transfer money between accounts', async () => {
    // Given
    const mockUserRepo = mock<UserRepository>();
    const mockAccountRepo = mock<AccountRepository>();
    const useCase = new TransferMoneyUseCase(mockUserRepo, mockAccountRepo);
    
    // When
    await useCase.execute('user1', 'user2', 100);
    
    // Then
    expect(mockUserRepo.save).toHaveBeenCalled();
  });
});
```

## 🎯 **Промпты для AI с чистой архитектурой**

### **Промпт для генерации Use Case:**

```
Создай Use Case для [функция] следуя принципам чистой архитектуры:

1. Use Case должен только оркестрировать, не содержать бизнес-логику
2. Все зависимости через интерфейсы
3. Четкие входные и выходные DTO
4. Обработка ошибок через доменные исключения

Пример структуры:
- Входной DTO
- Выходной DTO  
- Зависимости через интерфейсы
- Последовательность вызовов
```

### **Промпт для генерации Entity:**

```
Создай доменную сущность [название] с бизнес-логикой:

1. Все бизнес-правила внутри класса
2. Валидация инвариантов
3. Никаких внешних зависимостей
4. Методы отражают бизнес-операции

Пример:
- Конструктор с валидацией
- Бизнес-методы с проверками
- Приватные методы для логики
```

## 📊 **Метрики качества для AI-кода**

### **Проверочный список:**
- [ ] Entity содержат только бизнес-логику
- [ ] Use Cases только оркестрируют
- [ ] Нет прямых зависимостей от фреймворков в домене
- [ ] Четкие границы между слоями
- [ ] Тесты легко генерируются
- [ ] AI понимает структуру по одному файлу

### **Красные флаги:**
- ❌ Бизнес-логика в контроллерах
- ❌ Entity знают про базу данных
- ❌ Use Cases содержат детали реализации
- ❌ Зависимости нарушают Dependency Rule
- ❌ Смешивание ответственностей

## 🏗️ **Практическое применение в CRM**

Для нашей CRM-системы это означает:

```typescript
// ✅ Правильная структура
class TaskEntity {
  constructor(
    private id: string,
    private title: string,
    private status: TaskStatus
  ) {}
  
  moveToInProgress(): void {
    if (this.status !== TaskStatus.TODO) {
      throw new Error('Можно переводить только из TODO');
    }
    this.status = TaskStatus.IN_PROGRESS;
  }
}

class CreateTaskUseCase {
  async execute(dto: CreateTaskDto): Promise<TaskEntity> {
    const task = new TaskEntity(dto.id, dto.title, TaskStatus.TODO);
    await this.taskRepository.save(task);
    return task;
  }
}
```

## 🎯 **Итоговое правило**

**В эпоху AI архитектура - это не про "правильно", а про "понятно и проверяемо"**

1. **Начинайте с одного Use Case**
2. **Попробуйте сгенерировать тесты через AI**
3. **Если получается легко - вы на правильном пути**
4. **AI должен понимать структуру по одному файлу**
5. **Четкие границы = предсказуемая генерация**

## 📚 **Дополнительные ресурсы**

- [Clean Architecture by Robert Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Rich Domain Models vs Anemic Domain Models](https://martinfowler.com/bliki/AnemicDomainModel.html)
- [Dependency Rule](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html#the-dependency-rule)

---

**Помните:** Это правило поможет создавать код, который AI может генерировать качественно и который будет жить долго без переписывания! 🎉

**Дата создания:** ${new Date().toLocaleDateString('ru-RU')}  
**Версия:** 1.0.0  
**Статус:** ✅ Активно используется в проекте
