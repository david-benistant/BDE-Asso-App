import { Type, Static } from "@sinclair/typebox";

export const responseSchema = Type.Object({
    accessToken: Type.String(),
});

export type TResponse = Static<typeof responseSchema>;
