// MSW временно отключено из-за проблем с типами
// import { setupWorker } from 'msw';
// import { handlers } from './handlers';

// export const worker = setupWorker(...handlers);

// Заглушка для совместимости
export const worker = {
  start: () => Promise.resolve(),
  stop: () => Promise.resolve()
};


