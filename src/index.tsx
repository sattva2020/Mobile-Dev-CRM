import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// MSW: временно отключено из-за проблем с типами
// if (process.env.NODE_ENV === 'development' && (window as any).MSW_ENABLED === '1') {
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   const { worker } = require('./mocks/browser');
//   worker.start({ onUnhandledRequest: 'bypass' });
// }

// Инициализация приложения
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);