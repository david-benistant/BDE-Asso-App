import { Type, Static } from "@sinclair/typebox";

export const pathParamsSchema = Type.Object({
    id: Type.String(),
});

export type TPathParams = Static<typeof pathParamsSchema>;


export const bodySchema = Type.Object({
    displayName: Type.String({ minLength: 1 }),
    description: Type.String(),
});

export type TBody = Static<typeof bodySchema>;
