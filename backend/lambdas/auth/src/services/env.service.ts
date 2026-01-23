import ApiError, { ApiErrorStatus } from "./errors.service";

class EnvService {
    private JWT_SECRET: string;
    private ACCESS_KEY_ID: string;
    private SECREST_ACCESS_KEY: string;

    constructor() {
        this.JWT_SECRET = this.require("JWT_SECRET")
        this.ACCESS_KEY_ID = this.require("ACCESS_KEY_ID")
        this.SECREST_ACCESS_KEY = this.require("SECREST_ACCESS_KEY")
    }

    private require(name: string): string {
        const value = process.env[name];
        if (!value || value.length === 0) {
            throw new ApiError(500, ApiErrorStatus.INTERNAL_SERVER_ERROR, "Missing environnement variable")
        }
        return value;
    }

    getJwtSecret() {
        return this.JWT_SECRET;
    }

    getAccessKeyId() {
        return this.ACCESS_KEY_ID
    }

    getSecretAccessKey() {
        return this.SECREST_ACCESS_KEY
    }
}

export default new EnvService