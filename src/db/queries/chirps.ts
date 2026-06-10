import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { eq, asc } from "drizzle-orm";

export async function createChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getChirps() {
    return await db.select().from(chirps).orderBy(asc(chirps.createdAt));
}

export async function getChirpById(id: string) {
    const result = await db.select().from(chirps).where(eq(chirps.id, id));
    if (result.length === 0) {
      return;
    }
    return result[0];
}