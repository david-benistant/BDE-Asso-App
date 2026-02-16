import { APIGatewayProxyEventV2 } from "aws-lambda";

export type TypedAPIGatewayEvent<
    TBody = unknown,
    TPathParams extends Record<string, string> | undefined = undefined,
> = Omit<APIGatewayProxyEventV2, "body" | "pathParameters"> & {
    body: TBody;
    pathParameters: TPathParams;
};
