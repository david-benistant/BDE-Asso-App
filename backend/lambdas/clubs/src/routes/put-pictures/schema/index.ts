import { Type, Static } from "@sinclair/typebox";

export const pathPramsSchema = Type.Object({
    id: Type.String(),
});

export type TPathParams = Static<typeof pathPramsSchema>;


export const bodySchema = Type.Object({
    hashs: Type.Array(Type.String())
});

export type TBody = Static<typeof bodySchema>;
