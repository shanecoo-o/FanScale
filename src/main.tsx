import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {FanScaleRouterProvider} from './app/router.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FanScaleRouterProvider>
      <App />
    </FanScaleRouterProvider>
  </StrictMode>,
);
