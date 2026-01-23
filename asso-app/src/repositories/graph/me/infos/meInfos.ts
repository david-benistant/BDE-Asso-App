import { Result } from "@utils/Result";
import GraphProvider from "@repositories/graph/GraphProvider";
import meInfosValueObject, {
    type meInfosValueObjectProps,
} from "@valueObjects/me/infos/meInfos.valueObject";

export default class meInfos extends GraphProvider {
    constructor() {
        super("/v1.0/me");
    }

    async get(options: RequestInit = {}): Promise<Result<meInfosValueObject>> {
        const response =
            await this.callGraphJson<meInfosValueObjectProps>(options);

        if (response.isFailure) {
            return Result.fail<meInfosValueObject>("Failed to fetch me photo");
        }

        const object = new meInfosValueObject(response.getValue());

        return Result.ok<meInfosValueObject>(object);
    }
}
