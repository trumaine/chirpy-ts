import { eq, and, isNull, gt } from "drizzle-orm";
import { db } from "../index.js";
import { refreshTokens, users } from "../schema.js";
import { config } from "../../config.js";

export async function saveRefreshToken(userId: string, token: string) {
    const result = await db
        .insert(refreshTokens)
        .values({
            userId: userId, 
            token: token, 
            expiresAt: new Date(Date.now() + config.jwt.refreshDuration),
            revokedAt: null, 
        })
        .returning();
    return result.length > 0;
}

export async function userForRefreshToken(token: string) {
    const [result] = await db
        .select({ user: users })
        .from(users)
        .innerJoin(refreshTokens, eq(users.id, refreshTokens.userId))
        .where(
            and(
                eq(refreshTokens.token, token),
                isNull(refreshTokens.revokedAt),
                gt(refreshTokens.expiresAt, new Date()),
            )
        )
        .limit(1);
    return result;
}

export async function revokeRefreshToken(token: string) {
    const result = await db
        .update(refreshTokens)
        .set({ revokedAt: new Date() })
        .where(eq(refreshTokens.token, token))
        .returning();
    if (result.length === 0){
        throw new Error("Couldn't revoke token");
    }
}