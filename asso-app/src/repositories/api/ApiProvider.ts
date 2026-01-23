import { Result } from "@utils/Result";
import AuthProvider from "@repositories/AuthProvider"


abstract class ApiProvider {
    protected base: string = "http://localhost:3000";
    protected endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    protected async callApiJson(
        options: RequestInit = {},
    ): Promise<Result<object>> {
        const token = await AuthProvider.getApiToken();
        const res = await fetch(`${this.base}${this.endpoint}`, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            return Result.fail<object>("Failed to fetch");
        }
        return Result.ok<object>(await res.json());
    }
}

export default ApiProvider;
