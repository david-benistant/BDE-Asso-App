import { Type, Static } from "@sinclair/typebox";


export const responseSchema = Type.Array(
    Type.Object({
        userId: Type.String(),
        userEmail: Type.String(),
        userDisplayName: Type.String(),
        id: Type.String(),
        title: Type.String(),
        message: Type.String(),
        type: Type.String(),
        resourceId: Type.String(),
        expiresAt: Type.String(),
    }),
);

export type TResponse = Static<typeof responseSchema>;
