import { StrictMode } from 'react';
import './polyfills';
// Import designer library (includes all components and logic)
import '@microsoft/logic-apps-designer';
import { initializeIcons } from '@fluentui/react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
initializeIcons();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
