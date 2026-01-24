import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import ApiError, { ApiErrorStatus } from "./errors.service";

class s3Service {
    private client;

    constructor() {
        this.client = new S3Client({ region: "eu-west-3" });
    }

    generatePutPreSignedUrl = async (
        bucketName: string,
        fileName: string,
        expiresIn: number = 60,
    ): Promise<{ signedUrl: string; fileKey: string }> => {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            ContentType: "application/octet-stream",
        });

        let signedUrl = await getSignedUrl(this.client, command, { expiresIn });
        const urlObj = new URL(signedUrl);

        return { signedUrl: urlObj.toString(), fileKey: fileName };
    };

    putObject = async (
        bucketName: string,
        fileName: string,
        body: Uint8Array | string,
    ): Promise<void> => {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: body,
            ChecksumAlgorithm: undefined,
        });
        await this.client.send(command);
    };

    generateGetPreSignedUrl = async (
        bucketName: string,
        fileKey: string,
        expiresIn: number = 60,
    ): Promise<string> => {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
        });
        let signedUrl = await getSignedUrl(this.client, command, { expiresIn });
        return signedUrl;
    };

    getObject = async (
        bucketName: string,
        fileKey: string,
    ): Promise<Uint8Array> => {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
        });

        const response = await this.client.send(command);

        if (!response.Body) {
            throw new ApiError(
                404,
                ApiErrorStatus.NOT_FOUND,
                "Object not found",
            );
        }
        return response.Body.transformToByteArray();
    };

    deleteObject = async (
        bucketName: string,
        fileKey: string,
    ): Promise<void> => {
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
        });

        await this.client.send(command);
    };

    objectExists = async (
        bucketName: string,
        fileKey: string,
    ): Promise<boolean> => {
        try {
            const command = new HeadObjectCommand({
                Bucket: bucketName,
                Key: fileKey,
            });
            await this.client.send(command);
            return true;
        } catch (error: any) {
            if (
                error.name === "NotFound" ||
                error.$metadata?.httpStatusCode === 404
            ) {
                return false;
            }
            throw new ApiError(
                500,
                ApiErrorStatus.INTERNAL_SERVER_ERROR,
                error.message,
            );
        }
    };
}

export default new s3Service();
