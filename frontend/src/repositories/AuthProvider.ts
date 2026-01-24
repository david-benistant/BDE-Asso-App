import { PublicClientApplication, type AccountInfo } from "@azure/msal-browser";
import { msalConfig } from "@src/authConfig";
import { Result } from "@utils/Result";
import { jwtDecode } from "jwt-decode";

export interface GraphToken {
    oid: string;
    given_name: string;
    family_name: string;
    name: string;
    upn: string;
    appid: string;
}

class AuthProvider {
    private msalInstance: PublicClientApplication;
    private account: AccountInfo | null = null;
    private apiToken: string = "";
    private authApiEndpoint =
        "https://o2l9ffqy80.execute-api.eu-west-3.amazonaws.com/dev/auth/login";

    constructor() {
        this.msalInstance = new PublicClientApplication(msalConfig);
    }

    getInstance() {
        return this.msalInstance;
    }

    private async refreshApiToken(): Promise<Result<string>> {
        const graphToken = await this.getGraphToken();
        const response = await fetch(this.authApiEndpoint, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${graphToken}`,
            },
        });
        if (!response.ok) {
            return Result.fail<string>("Failed to refresh access token");
        }
        const body = await response.json();
        return Result.ok<string>(body.accessToken);
    }

    async getApiToken(): Promise<Result<string>> {
        try {
            if (this.apiToken.length === 0)
                throw new Error("Expired token")
            const payload = jwtDecode(this.apiToken);
            const now = Math.floor(Date.now() / 1000);

            if (!payload.exp || now >= payload?.exp) 
                throw new Error("Expired token")
            return Result.ok<string>(this.apiToken)
        } catch {
            const token = await this.refreshApiToken();
            if (token.isSuccess) this.apiToken = token.getValue();
            return token;
        }
    }

    async getGraphToken() {
        if (!this.account) {
            const accounts = this.msalInstance.getAllAccounts();
            if (accounts.length > 0) {
                this.account = accounts[0];
            }
        }
        if (!this.account) return;
        const token = await this.msalInstance.acquireTokenSilent({
            account: this.account,
            scopes: ["User.Read"],
        });

        console.log(token.accessToken);
        return token.accessToken;
    }

    async getAccountInfos(): Promise<GraphToken | null> {
        const token = await this.getGraphToken();

        if (!token) {
            return null;
        }
        const infos = jwtDecode(token);
        return infos as GraphToken;
    }
}

export default new AuthProvider();
