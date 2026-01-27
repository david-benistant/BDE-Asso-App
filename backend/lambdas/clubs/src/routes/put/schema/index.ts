import { Type, Static } from "@sinclair/typebox";

export const pathPramsSchema = Type.Object({
    id: Type.String(),
});

export type TPathParams = Static<typeof pathPramsSchema>;


export const bodySchema = Type.Object({
    displayName: Type.String({ minLength: 1 }),
    description: Type.String(),
});

export type TBody = Static<typeof bodySchema>;
