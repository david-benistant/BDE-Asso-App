import ApiError, { ApiErrorStatus } from "./errors.service";

class EnvService {
    private JWT_SECRET: string;
    private MAILGUN_KEY: string;

    constructor() {
        this.JWT_SECRET = this.require("JWT_SECRET");
        this.MAILGUN_KEY = this.require("MAILGUN_KEY");
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

    getMailGunKey() {
        return this.MAILGUN_KEY
    }
}

export default new EnvService();
