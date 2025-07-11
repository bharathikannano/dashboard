import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

export const root = ReactDOM.createRoot(document.getElementById('root'));

export const renderApp = () => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

if (process.env.NODE_ENV !== 'test') {
  renderApp();
}
