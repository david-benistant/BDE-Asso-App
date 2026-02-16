import { Type, Static } from "@sinclair/typebox";

export const bodySchema = Type.Object({
    title: Type.String(),
    description: Type.String(),
    date: Type.Number(),
    duration: Type.Number()
});

export type TBody = Static<typeof bodySchema>;

export const pathParamsSchema = Type.Object({
    clubId: Type.String(),
    eventId: Type.String()
});

export type TPathParams = Static<typeof pathParamsSchema>;
