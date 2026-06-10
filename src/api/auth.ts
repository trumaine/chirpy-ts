import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash } from "../auth.js";
import { respondWithJSON } from "./json.js";
import { BadRequestError, UserNotAuthenticatedError } from "./errors.js";

import { Request, Response } from "express";
import { UserResponse } from "../db/schema.js";

export async function handlerLogin(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
    };
    const params: parameters = req.body;

    if (!params.email || !params.password) {
        throw new BadRequestError("Missing required fields");
    }

    const user = await getUserByEmail(params.email);
    if (!user) {
        throw new UserNotAuthenticatedError("incorrect email or password");
    }

    const matching = await checkPasswordHash(
        params.password, 
        user.hashedPassword,
    );
    if (!matching) {
        throw new UserNotAuthenticatedError("incorrect email or password");
    }
    
    respondWithJSON(res, 200, {
        id: user.id, 
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    } satisfies UserResponse);
}