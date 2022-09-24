import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './tailwind.css';
import { StyledEngineProvider } from '@mui/material/styles';
import GlobalStyles from './globalTheme';
import NavBar from './pages/Nav/NavBar';
import Resume from './pages/Resume/Resume';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById("root"));


root.render(
  <React.StrictMode >
    <StyledEngineProvider injectFirst>
      <GlobalStyles />
      <Router>
        <div className="static">
        <NavBar/>
      </div>
          <Routes>
            <Route path="/" element={<App />} exact />
            <Route path="/resume" element={<Resume />} />
          </Routes>
      </Router>
    </StyledEngineProvider>
  </React.StrictMode>
);

