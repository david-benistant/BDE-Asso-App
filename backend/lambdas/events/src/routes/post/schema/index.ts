import { Type, Static } from "@sinclair/typebox";

export const bodySchema = Type.Object({
    title: Type.String(),
    description: Type.String(),
    attachedFiles: Type.Array(Type.String()),
    date: Type.Number(),
    visibility: Type.String(),
    duration: Type.Number()
});

export type TBody = Static<typeof bodySchema>;

export const pathParamsSchema = Type.Object({
    clubId: Type.String(),
});

export type TPathParams = Static<typeof pathParamsSchema>;

export const responseSchema = Type.Object({
    id: Type.String(),
    presgignedUrls: Type.Array(Type.Object({
        name: Type.String(),
        url: Type.String()
    })),
});

export type TResponse = Static<typeof responseSchema>;
