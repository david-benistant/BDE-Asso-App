import { Type, Static } from "@sinclair/typebox";

export const pathParamsSchema = Type.Object({
    id: Type.String(),
});

export type TPathParams = Static<typeof pathParamsSchema>;


export const responseSchema = Type.Object({
    id: Type.String(),
    name: Type.String(),
    displayName: Type.String(),
    description: Type.String(),
    presidentId: Type.String(),
    thumbnail: Type.String(),
    pictures: Type.Array(Type.String()),
    members: Type.Array(Type.String()),
    followers: Type.Array(Type.String()),
});

export type TResponse = Static<typeof responseSchema>;
