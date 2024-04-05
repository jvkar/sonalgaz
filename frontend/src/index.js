import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { FactureContextProvider } from "./context/factureContext";
import { CLientContextProvider } from "./context/clientContext";
import { EtablissementContextProvider } from "./context/etablissementContext";
import { AgenceContextProvider } from "./context/agenceContext";
import { TechnicienContextProvider } from "./context/technicienContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <TechnicienContextProvider>
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
    </TechnicienContextProvider>
  </React.StrictMode>
);
