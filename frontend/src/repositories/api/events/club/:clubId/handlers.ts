import ApiProvider from "@repositories/api/ApiProvider";
import { Result } from "@utils/Result";

export default class extends ApiProvider {
    constructor(clubId: string) {
        super(`/events/club/${clubId}`);
    }

    async post(props: {
        title: string;
        description: string;
        attachedFiles: {
            name: string;
            buf: ArrayBuffer;
        }[];
        date: Date;
        visibility: string;
        duration: number;
    }): Promise<Result<string>> {
        const response = await this.callApiJson<{
            id: string;
            presgignedUrls: { name: string; url: string }[];
        }>({
            method: "POST",
            body: JSON.stringify({
                ...props,
                attachedFiles: props.attachedFiles.map((file) => {
                    return file.name;
                }),
                date: props.date.getTime() / 1000,
            }),
        });

        if (response.isFailure) {
            return Result.fail<string>("Failed to create event");
        }

        const urls = response.getValue().presgignedUrls;

        await Promise.all(
            urls.map(async (url) => {
                try {
                    const file = props.attachedFiles.find((file) => file.name === url.name)
                    if (!file) return
                    await fetch(url.url, {
                        method: "PUT",
                        body: file.buf,
                        headers: {
                            "Content-Type": "application/octet-stream",
                        },
                    });
                } catch {
                    console.error("failed to upload picture");
                }
            }),
        );

        return Result.ok<string>(response.getValue().id);
    }
}
