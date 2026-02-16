import { Type, Static } from "@sinclair/typebox";

export const pathParamsSchema = Type.Object({
    id: Type.String(),
});

export type TPathParams = Static<typeof pathParamsSchema>;


export const bodySchema = Type.Object({
    members: Type.Array(Type.Object({
        id: Type.String(),
        role: Type.String()
    }))
});

export type TBody = Static<typeof bodySchema>;
