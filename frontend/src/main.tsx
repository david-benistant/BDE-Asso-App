import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
// import { PublicClientApplication } from "@azure/msal-browser"
import { MsalProvider } from "@azure/msal-react"
// import { msalConfig } from "./authConfig"
import './index.css'

import AuthProvider from "./repositories/AuthProvider";

import { ToastProvider } from "@contexts/ToastContext"


// const msalInstance = new PublicClientApplication(msalConfig)

const root = ReactDOM.createRoot(document.getElementById("root")!)
root.render(
  // <React.StrictMode>
    <MsalProvider instance={AuthProvider.getInstance()}>
      <ToastProvider>

        <App />
      </ToastProvider>
    </MsalProvider>
  // </React.StrictMode>
)
