const fs = require('fs');
const path = require('path');

// Функция для рекурсивного поиска файлов
function findFiles(dir, extension) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(filePath, extension));
    } else if (file.endsWith(extension)) {
      results.push(filePath);
    }
  });
  
  return results;
}

// Функция для исправления уведомлений
function fixNotifications(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Паттерн для поиска addNotification без read
  const pattern = /actions\.addNotification\(\{([^}]+)\}\)/g;
  
  content = content.replace(pattern, (match, notificationBody) => {
    // Проверяем, есть ли уже свойство read
    if (notificationBody.includes('read:')) {
      return match;
    }
    
    // Добавляем read: false перед закрывающей скобкой
    const fixedBody = notificationBody.trim().endsWith(',') 
      ? notificationBody + '\n        read: false,'
      : notificationBody + ',\n        read: false';
    
    modified = true;
    return `actions.addNotification({\n        ${fixedBody}\n      })`;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
  }
}

// Находим все TypeScript файлы
const tsFiles = findFiles('./src', '.tsx').concat(findFiles('./src', '.ts'));

console.log('Fixing notification calls...');

tsFiles.forEach(file => {
  try {
    fixNotifications(file);
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log('Done!');
