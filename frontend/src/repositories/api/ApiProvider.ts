import { Result } from "@utils/Result";
import AuthProvider from "@repositories/AuthProvider"


abstract class ApiProvider {
    protected base: string = "https://o2f8htp258.execute-api.eu-west-3.amazonaws.com/dev";
    protected endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    protected async callApiJson<T>(
        options: RequestInit = {},
    ): Promise<Result<T>> {
        const token = await AuthProvider.getApiToken();
        if (token.isFailure) {
            return Result.fail<T>(token.getError());
        }
        const res = await fetch(`${this.base}${this.endpoint}`, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${token.getValue()}`,
            },
        });

        if (!res.ok) {
            return Result.fail<T>("Failed to fetch");
        }

        if (res.status === 204){
            return Result.ok<T>()
        }
        return Result.ok<T>(await res.json());
    }
}

export default ApiProvider;
