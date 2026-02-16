import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    GetCommand,
    GetCommandInput,
    PutCommand,
    PutCommandInput,
    QueryCommandInput,
    ScanCommand,
    ScanCommandInput,
    DeleteCommand,
    DeleteCommandInput,
    QueryCommand,
    BatchWriteCommand,
    BatchWriteCommandInput,
} from "@aws-sdk/lib-dynamodb";
import ApiError, { ApiErrorStatus } from "./errors.service";

class DynamoService {
    private client = new DynamoDBClient({ region: "eu-west-3" });
    private docClient = DynamoDBDocumentClient.from(this.client);

    async get<T>(input: GetCommandInput): Promise<T> {
        const result = await this.docClient.send(new GetCommand(input));

        if (!result.Item) {
            throw new ApiError(404, ApiErrorStatus.NOT_FOUND);
        }

        return result.Item as T;
    }

    async put<T>(input: PutCommandInput): Promise<T> {
        try {
            await this.docClient.send(new PutCommand(input));
            return input.Item as T;
        } catch {
            throw new ApiError(500, ApiErrorStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async scan<T>(input: ScanCommandInput): Promise<T[]> {
        try {
            const result = await this.docClient.send(new ScanCommand(input));
            return (result.Items ?? []) as T[];
        } catch (e) {
            console.log(e);
            throw new ApiError(500, ApiErrorStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async query<T>(input: QueryCommandInput): Promise<T[]> {
        try {
            const result = await this.docClient.send(new QueryCommand(input));
            return (result.Items ?? []) as T[];
        } catch (e) {
            console.log(e)
            throw new ApiError(500, ApiErrorStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(input: DeleteCommandInput): Promise<void> {
        try {
            await this.docClient.send(new DeleteCommand(input));
        } catch (e) {
            console.log(e)
            throw new ApiError(500, ApiErrorStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async batchPut<T>(tableName: string, items: T[]): Promise<void> {
        const MAX_BATCH = 25;
        for (let i = 0; i < items.length; i += MAX_BATCH) {
            const batchItems = items.slice(i, i + MAX_BATCH).map((item) => ({
                PutRequest: { Item: item },
            }));
            const params: BatchWriteCommandInput = {
                RequestItems: { [tableName]: batchItems },
            };
            try {
                await this.docClient.send(new BatchWriteCommand(params));
            } catch {
                throw new ApiError(500, ApiErrorStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}

export default new DynamoService();
