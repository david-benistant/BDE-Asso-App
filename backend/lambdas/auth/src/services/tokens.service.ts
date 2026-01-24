import { jwtDecode, JwtPayload } from "jwt-decode";
import UserValueObject, {
    userValueObjectProps,
} from "../valueObjects/users.valueObject";
import jwt from "jsonwebtoken";
import envService from "./env.service";
import ApiError, { ApiErrorStatus } from "./errors.service";

interface GraphToken {
    oid: string;
    given_name: string;
    family_name: string;
    name: string;
    upn: string;
    appid: string;
}

class TokensService {
    decodeAzureToken(accesToken: string): GraphToken {
        return jwtDecode(accesToken) as GraphToken;
    }

    generateAccessToken(user: UserValueObject): string {
        return jwt.sign(user.getObject(), envService.getJwtSecret(), {
            expiresIn: 60 * 60,
        });
    }

    verifyAccessToken(accessToken: string) {
        try {
            const payload = jwt.verify(
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
