
import ApiError, { ApiErrorStatus } from "./errors.service";


interface GraphToken {
    oid: string;
    given_name: string;
    family_name: string;
    name: string;
    upn: string;
    appid: string;
}

interface Me {
    businessPhones: string[];
    displayName: string;
    givenName: string;
    jobTitle: string;
    mail: string;
    mobilePhone: string;
    officeLocation: string;
    preferredLanguage: string;
    surname: string;
    userPrincipalName: string;
    id: string;
}
class GraphService {
    private endpoint = "https://graph.microsoft.com"

 
    async getMe (accessToken: string): Promise<Me> {
        const req = await fetch(`${this.endpoint}/v1.0/me`, {
            headers: {
                "Authorization" : `Bearer ${accessToken}`
            }
        });

        if (!req.ok) {
            throw new ApiError(401, ApiErrorStatus.UNAUTHORIZED, "Invalid Azure access token")
        }

        return await req.json()
    }


}

export default new GraphService();
