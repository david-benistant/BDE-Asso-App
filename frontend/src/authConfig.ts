import type { Configuration, PopupRequest } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "25962da1-190d-479b-889f-d47b6c92c3af",
    authority: "https://login.microsoftonline.com/901cb4ca-b862-4029-9306-e5cd0f6d9f86",
    redirectUri: "http://localhost:5173",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  }
};

export const loginRequest: PopupRequest = {
  scopes: ["user.read"]
};  