import { PublicClientApplication, type AccountInfo } from "@azure/msal-browser";
import { msalConfig } from "@src/authConfig";
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
    private apiToken: string = ""

    constructor() {
        this.msalInstance = new PublicClientApplication(msalConfig);
    }

    getInstance() {
        return this.msalInstance;
    }

    async getApiToken() {
        // if (!this.account) {
        //     const accounts = this.msalInstance.getAllAccounts();
        //     if (accounts.length > 0) {
        //         this.account = accounts[0]
        //     }
        // }
        // if (!this.account) return;

        // console.log(this.account)
        // const token = await this.msalInstance.acquireTokenSilent({
        //     account: this.account,
        //     scopes: ["api://25962da1-190d-479b-889f-d47b6c92c3af/access_as_user"]
        // });

        // // console.log(token.idTokenClaims)
        // return token.accessToken;
    }

    async getGraphToken() {

        if (!this.account) {
            const accounts = this.msalInstance.getAllAccounts();
            if (accounts.length > 0) {
                this.account = accounts[0]
            }
        }
        if (!this.account) return;
        const token = await this.msalInstance.acquireTokenSilent({
            account: this.account,
            scopes: ["User.Read"],
        });

        console.log(token.accessToken)
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
