import ApiProvider from "@repositories/api/ApiProvider";
import { Result } from "@utils/Result";
import MD5 from "crypto-js/md5";
import WordArray from "crypto-js/lib-typedarrays";

export default class extends ApiProvider {
    constructor(id: string) {
        super(`/clubs/${id}/thumbnail`);
    }

    async put(image: ArrayBuffer): Promise<Result<void>> {
        const hash: string = MD5(WordArray.create(image)).toString();
        const response = await this.callApiJson<{ presignedUrl: string }>({
            method: "PUT",
            body: JSON.stringify({ hash }),
        });

        if (response.isFailure) {
            return Result.fail<undefined>("Failed to update club thumbnail");
        }

        const presignedUrlResponse = await fetch(
            response.getValue().presignedUrl,
            {
                method: "PUT",
                body: image,
                headers: {
                    "Content-Type": "image/png",
                },
            },
        );

        if (!presignedUrlResponse.ok) {
            return Result.fail<undefined>("Failed to update club thumbnail");
        }
        return Result.ok<undefined>();
    }
}
