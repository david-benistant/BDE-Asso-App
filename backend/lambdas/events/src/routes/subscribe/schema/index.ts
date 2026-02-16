import { Type, Static } from "@sinclair/typebox";


export const pathParamsSchema = Type.Object({
    clubId: Type.String() ,
    id: Type.String(),
});

export type TPathParams = Static<typeof pathParamsSchema>;

