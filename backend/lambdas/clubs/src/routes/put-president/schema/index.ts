import { Type, Static } from "@sinclair/typebox";

export const pathParamsSchema = Type.Object({
    id: Type.String(),
    memberId: Type.String()
});

export type TPathParams = Static<typeof pathParamsSchema>;
