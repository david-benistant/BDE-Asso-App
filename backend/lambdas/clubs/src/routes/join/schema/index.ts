import { Type, Static } from "@sinclair/typebox";

export const pathParamsSchema = Type.Object({
    id: Type.String(),
});

export type TPathParams = Static<typeof pathParamsSchema>;

export const bodySchema = Type.Object({
    message: Type.Optional(Type.String()),
});

export type TBody = Static<typeof bodySchema>;