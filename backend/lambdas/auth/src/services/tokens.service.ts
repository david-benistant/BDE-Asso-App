import { jwtDecode } from "jwt-decode";
import UserValueObject from "../valueObjects/users.valueObject";
import jwt from "jsonwebtoken"
import envService from "./env.service";

interface GraphToken {
    oid: string;
    given_name: string;
    family_name: string;
    name: string;
    upn: string;
    appid: string;
}


class TokensService {
    decodeAzureToken(accesToken: string) : GraphToken {
        return jwtDecode(accesToken) as GraphToken;
    }

    generateAccessToken(user: UserValueObject): string {
        return jwt.sign(user.getObject(), envService.getJwtSecret(), { expiresIn: 60 * 60 })
    }
}

export default new TokensService()