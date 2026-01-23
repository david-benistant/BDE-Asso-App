import { Result } from "@utils/Result";
import AuthProvider from "@repositories/AuthProvider"

abstract class GraphProvider {
    protected base: string = "https://graph.microsoft.com"
    protected endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint
    }

    protected async callGraphJson<T>(options: RequestInit = {}): Promise<Result<T>> {
        const token = await AuthProvider.getGraphToken()
        const res = await fetch(`${this.base}${this.endpoint}`, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${token}`,
            },
        })

        if (!res.ok) {
            return Result.fail<T>("Failed to fetch")
        }
        return Result.ok<T>(await res.json())
    }

    protected async callGraphBlob(options: RequestInit = {}): Promise<Result<Blob>> {
        const token = await AuthProvider.getGraphToken()
        const res = await fetch(`${this.base}${this.endpoint}`, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${token}`,
            },
        })

        if (!res.ok) {
            return Result.fail<Blob>("Failed to fetch")
        }
        return Result.ok<Blob>(await res.blob())
    }
}

export default GraphProvider