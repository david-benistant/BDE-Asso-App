import { JwtPayload, verify } from "jsonwebtoken";
import envService from "./env.service";
import { userValueObjectProps } from "@valueObjects/users.valueObject";
import ApiError, { ApiErrorStatus } from "./errors.service";

class TokensService {
    verifyAccessToken(accessToken: string) {
        try {
            const payload = verify(
                accessToken,
                envService.getJwtSecret(),
            ) as JwtPayload & userValueObjectProps;
            return payload;
        } catch (e) {
            throw new ApiError(
                403,
                ApiErrorStatus.FORBIDDEN,
                "Invalid access token",
            );
        }
    }
}

export default new TokensService();
