import { Type, Static } from "@sinclair/typebox";

export const pathParamsSchema = Type.Object({
    id: Type.String(),
});

export type TPathParams = Static<typeof pathParamsSchema>;

export const responseSchema = Type.Object({
    accessToken: Type.String(),
});

export type TResponse = Static<typeof responseSchema>;
