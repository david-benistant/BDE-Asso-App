import userValueObject from "@valueObjects/users/user.valueObject";
import ApiProvider from "@repositories/api/ApiProvider";
import type { userValueObjectProps } from "@valueObjects/users/user.valueObject";
import { Result } from "@utils/Result";


export default class extends ApiProvider {

    constructor(id: string) {
        super(`/users/${id}`)
    }

    async get(): Promise<Result<userValueObject>> {
        const response = await this.callApiJson<userValueObjectProps>()

        if (response.isFailure) {
            return Result.fail<userValueObject>("Failed to get user")
        }

        const object = new userValueObject(response.getValue())

        return Result.ok<userValueObject>(object)
    }

}