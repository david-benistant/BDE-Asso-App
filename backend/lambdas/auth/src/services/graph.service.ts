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
    private endpoint = "https://graph.microsoft.com";

    async getMe(accessToken: string): Promise<Me> {
        const response = await fetch(`${this.endpoint}/v1.0/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new ApiError(
                401,
                ApiErrorStatus.UNAUTHORIZED,
                "Invalid Azure access token",
            );
        }

        return await response.json();
    }

    async getMePhoto(accessToken: string): Promise<Buffer<ArrayBuffer>> {
        console.log("fetching photo");
        const response = await fetch(`${this.endpoint}/v1.0/me/photo/$value`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log(response.ok);

        if (!response.ok) {
            console.log(response.body);
            throw new ApiError(
                500,
                ApiErrorStatus.INTERNAL_SERVER_ERROR,
                "An occured while fetching photo",
            );
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return buffer;
    }
}

export default new GraphService();
