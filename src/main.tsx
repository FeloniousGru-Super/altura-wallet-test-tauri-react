import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./contexts/Theme.context.tsx";
import { WalletProvider } from "./contexts/Wallet.context.tsx";
import { BrowserRouter } from "react-router-dom";
import { StatusProvider } from "./contexts/Status.context.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <StatusProvider>
          <WalletProvider>
            <App />
          </WalletProvider>
        </StatusProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
