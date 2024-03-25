import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { FactureContextProvider } from './context/factureContext';
import { CLientContextProvider } from './context/clientContext';
import { EtablissementContextProvider } from './context/etablissementContext';
import { AgenceContextProvider } from './context/agenceContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
    <AgenceContextProvider>
    <EtablissementContextProvider>
    <FactureContextProvider>
      <CLientContextProvider>
    <App />
    </CLientContextProvider>
    </FactureContextProvider>
    </EtablissementContextProvider>
    </AgenceContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

