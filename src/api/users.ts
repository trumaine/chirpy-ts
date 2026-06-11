import { Request, Response } from "express";

import { createUser, updateUser } from "../db/queries/users.js";
import { BadRequestError, UserNotAuthenticatedError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { getBearerToken, hashPassword, validateJWT } from "../auth.js";
import { UserResponse } from "../db/schema.js";
import { config } from "../config.js";

export async function handlerUsersCreate(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
    };
    const params: parameters = req.body;

    if (!params.password || !params.email) {
        throw new BadRequestError("Missing required fields");
    }

    const hashedPassword = await hashPassword(params.password);

    const user = await createUser({
        email: params.email,
        hashedPassword: hashedPassword,
    });

    if (!user) {
        throw new Error("Could not create user");
    }

    respondWithJSON(res, 201, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    } satisfies UserResponse);
}

export async function handlerUsersUpdate(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
    };
    const params: parameters = req.body;

    if (!params.password || !params.email) {
        throw new BadRequestError("Missing required fields");
    }

    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwt.secret);
    if (!userId) {
        throw new UserNotAuthenticatedError("Invalid token");
    }

    const hashedPassword = await hashPassword(params.password);

    const user = await updateUser(userId, params.email, hashedPassword);

    if (!user) {
        throw new Error("Could not update user");
    }

    respondWithJSON(res, 200, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    } satisfies UserResponse);
}