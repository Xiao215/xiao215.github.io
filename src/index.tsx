import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './tailwind.css';
import { StyledEngineProvider } from '@mui/material/styles';
import './assets/fonts/style.css';
import './assets/fonts/FLIX/Web Fonts/stylesheet.css';

const root = ReactDOM.createRoot(
  document.getElementById('root')as HTMLElement
);

root.render(
  <React.StrictMode >
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  </React.StrictMode>
);

