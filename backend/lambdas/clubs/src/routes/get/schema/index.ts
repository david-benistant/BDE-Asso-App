import { Type, Static } from "@sinclair/typebox";

export const pathPramsSchema = Type.Object({
    id: Type.String(),
});

export type TPathParams = Static<typeof pathPramsSchema>;


export const responseSchema = Type.Object({
    id: Type.String(),
    name: Type.String(),
    displayName: Type.String(),
    description: Type.String(),
    presidentId: Type.String(),
    thumbnail: Type.String(),
    pictures: Type.Array(Type.String()),
    members: Type.Array(Type.String()),
    nbFollowers: Type.Number(),
});

export type TResponse = Static<typeof responseSchema>;
