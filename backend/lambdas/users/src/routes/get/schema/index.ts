import { Type, Static } from "@sinclair/typebox";

export const pathPramsSchema = Type.Object({
    id: Type.String(),
});

export type TPathParams = Static<typeof pathPramsSchema>;

export const responseSchema = Type.Object({
    accessToken: Type.String(),
});

export type TResponse = Static<typeof responseSchema>;
