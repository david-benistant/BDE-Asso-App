import ApiProvider from "@repositories/api/ApiProvider";
import { Result } from "@utils/Result";
import MD5 from "crypto-js/md5";
import WordArray from "crypto-js/lib-typedarrays";

export default class extends ApiProvider {
    constructor(id: string) {
        super(`/clubs/${id}/pictures`);
    }

    async put(images: ArrayBuffer[]): Promise<Result<undefined>> {
        const hashs: { hash: string; image: ArrayBuffer }[] = images.map(
            (image) => {
                return {
                    hash: MD5(WordArray.create(image)).toString(),
                    image,
                };
            },
        );

        const response = await this.callApiJson<{
            presignedUrls: { hash: string , url: string }[];
        }>({
            method: "PUT",
            body: JSON.stringify({ hashs: hashs.map((hash) => hash.hash) }),
        });

        if (response.isFailure) {
            return Result.fail<undefined>("Failed to upload pictures");
        }

        const presignedUrls = response.getValue().presignedUrls;

        await Promise.all(
            hashs.map(async (hash) => {
                const url = presignedUrls.find((h) => h.hash === hash.hash)?.url
                if (!url) return
                await fetch(url , {
                    method: "PUT",
                    body: hash.image,
                    headers: {
                        "Content-Type": "image/png",
                    },
                });
            }),
        );

        return Result.ok<undefined>();
    }
}
