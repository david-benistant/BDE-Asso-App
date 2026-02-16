import { Type, Static } from "@sinclair/typebox";

export const pathParamsSchema = Type.Object({
    id: Type.String(),
    userId: Type.String()
});

export type TPathParams = Static<typeof pathParamsSchema>;
