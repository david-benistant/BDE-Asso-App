import ApiError, { ApiErrorStatus } from "./errors.service";

class EnvService {
    private JWT_SECRET: string;

    constructor() {
        this.JWT_SECRET = this.require("JWT_SECRET");
    }

    private require(name: string): string {
        const value = process.env[name];
        if (!value || value.length === 0) {
            throw new ApiError(
                500,
                ApiErrorStatus.INTERNAL_SERVER_ERROR,
                "Missing environnement variable",
            );
        }
        return value;
    }

    getJwtSecret() {
        return this.JWT_SECRET;
    }
}

export default new EnvService();
