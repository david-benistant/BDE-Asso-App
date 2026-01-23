import { Result } from "@utils/Result";
import mePhotoValueObject from "@valueObjects/me/photo/mePhoto.valueObject";
import GraphProvider from "@repositories/graph/GraphProvider";




export default class mePhoto extends GraphProvider {

    constructor() {
        super("/v1.0/me/photo/$value")
    }

    async get(options: RequestInit = {}): Promise<Result<mePhotoValueObject>> {
        const response = await this.callGraphBlob(options)

        if (response.isFailure) {
            return Result.fail<mePhotoValueObject>("Failed to fetch me photo")
        }

        const object = new mePhotoValueObject({ url: URL.createObjectURL(response.getValue())});


        return Result.ok<mePhotoValueObject>(object)
    }

}

