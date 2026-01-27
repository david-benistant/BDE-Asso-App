import ApiProvider from "@repositories/api/ApiProvider";
import { Result } from "@utils/Result";
import ClubValueObject, {
    type clubValueObjectProps,
} from "@valueObjects/clubs/club.valueObject";

export default class extends ApiProvider {
    constructor() {
        super(`/clubs`);
    }

    async post(clubName: string): Promise<Result<ClubValueObject>> {
        const response = await this.callApiJson<clubValueObjectProps>({
            method: "POST",
            body: JSON.stringify({
                name: clubName,
            }),
        });

        if (response.isFailure) {
            return Result.fail<ClubValueObject>("Failed to create club");
        }

        const object = new ClubValueObject(response.getValue());

        return Result.ok<ClubValueObject>(object);
    }

    async list(): Promise<Result<ClubValueObject[]>> {
        const response = await this.callApiJson<clubValueObjectProps[]>({
        });

        if (response.isFailure) {
            return Result.fail<ClubValueObject[]>("Failed to list clubs");
        }

        const objects = response.getValue().map((c) => new ClubValueObject(c))

        return Result.ok<ClubValueObject[]>(objects);
    }
}