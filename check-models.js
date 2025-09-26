#!/usr/bin/env node

/**
 * Проверка доступных моделей в OpenRouter
 */

const axios = require('axios');

const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY || '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';

async function checkModels() {
  try {
    console.log('🔍 Проверка доступных моделей...');
    
    const response = await axios.get('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Доступные модели:');
    console.log('=' .repeat(50));
    
    const models = response.data.data;
    const grokModels = models.filter(model => 
      model.id.includes('grok') || 
      model.id.includes('x-ai') ||
      model.name?.toLowerCase().includes('grok')
    );
    
    console.log('🤖 Grok модели:');
    grokModels.forEach(model => {
      console.log(`- ${model.id}`);
      console.log(`  Название: ${model.name}`);
      console.log(`  Контекст: ${model.context_length}`);
      console.log(`  Провайдер: ${model.provider}`);
      console.log(`  Цена: ${model.pricing?.prompt || 'N/A'}`);
      console.log('');
    });
    
    // Проверим доступность конкретной модели
    const targetModel = 'x-ai/grok-4-fast:free';
    const isAvailable = models.some(model => model.id === targetModel);
    
    console.log(`🎯 Модель ${targetModel}: ${isAvailable ? '✅ Доступна' : '❌ Недоступна'}`);
    
    if (!isAvailable) {
      console.log('\n💡 Альтернативные модели:');
      const alternatives = models.filter(model => 
        model.id.includes('grok') || 
        model.id.includes('x-ai') ||
        (model.pricing?.prompt === '0' && model.pricing?.completion === '0')
      );
      
      alternatives.forEach(model => {
        console.log(`- ${model.id} (${model.name})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Ошибка при проверке моделей:', error.response?.data || error.message);
  }
}

checkModels();
