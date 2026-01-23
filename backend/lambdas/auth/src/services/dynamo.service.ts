import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    GetCommand,
    GetCommandInput,
    PutCommand,
    PutCommandInput,
} from "@aws-sdk/lib-dynamodb";
import ApiError, { ApiErrorStatus } from "./errors.service";

class DynamoService {
    private client = new DynamoDBClient({ region: "eu-west-3" });
    private docClient = DynamoDBDocumentClient.from(this.client);

    async get<T>(input: GetCommandInput): Promise<T> {
        console.log("DYNAMO START", input.TableName);

        const result = await this.docClient.send(new GetCommand(input));

        console.log("DYNAMO END", result);

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
}

export default new DynamoService();
