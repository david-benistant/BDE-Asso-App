import { Type, Static } from "@sinclair/typebox";

export const pathParamsSchema = Type.Object({
    clubId: Type.String(),
    visibility: Type.String()
});

export type TPathParams = Static<typeof pathParamsSchema>;

export const responseSchema = Type.Array(Type.Object({
    clubId: Type.String(),
    id: Type.String(),
    title: Type.String(),
    description: Type.String(),
    attachedObjects: Type.Array(Type.String()),
    createdAt: Type.Number(),
    date: Type.Number(),
    expiresAt: Type.Number(),
    visibility: Type.String()
}))

export type TResponse = Static<typeof responseSchema>;
