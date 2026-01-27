import ApiProvider from "@repositories/api/ApiProvider";
import { Result } from "@utils/Result";
import ClubValueObject, {
    type clubValueObjectProps,
} from "@valueObjects/clubs/club.valueObject";

export default class extends ApiProvider {
    constructor(id: string) {
        super(`/clubs/${id}`);
    }
    async get(): Promise<Result<ClubValueObject>> {
        const response = await this.callApiJson<clubValueObjectProps>();

        if (response.isFailure) {
            return Result.fail<ClubValueObject>("Failed to get club");
        }

        const object = new ClubValueObject(response.getValue());

        return Result.ok<ClubValueObject>(object);
    }

    async put(props: { displayName: string; description: string }): Promise<Result<undefined>> {
        const response = await this.callApiJson({
            method: "PUT",
            body: JSON.stringify(props)
        });

        if (response.isFailure) {
            return Result.fail<undefined>("Failed to update club");
        }
        return Result.ok<undefined>()
    }
}
