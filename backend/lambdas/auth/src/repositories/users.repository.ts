import propertiesService from "../services/properties.service"
import dynamoService from "../services/dynamo.service"
import UserValueObject, { userValueObjectProps } from "../valueObjects/users.valueObject"
import ApiError, { ApiErrorStatus } from "../services/errors.service"

class UserRepository {
    private name = propertiesService.getUserTable()

    public async getUser (id: string): Promise<userValueObjectProps> {
        try {
            const result = await dynamoService.get<userValueObjectProps>({
                TableName: this.name,
                Key : {
                    id
                }
            })

            return result;
        } catch (e) {
            if (e instanceof ApiError) {
                throw e
            } else {
                throw new ApiError(500, ApiErrorStatus.INTERNAL_SERVER_ERROR, JSON.stringify(e))
            }
        }
    }

    public async getUserNoThrow (id: string): Promise<userValueObjectProps | undefined> {
        try {
            const result = await dynamoService.get<userValueObjectProps>({
                TableName: this.name,
                Key : {
                    id
                }
            })

            return result;
        } catch (e) {
            return undefined
        }
    }

    public async putUser(user: UserValueObject) {
        await dynamoService.put({
            TableName: this.name,
            Item: user.getObject()
        })
    }
}

export default new UserRepository()