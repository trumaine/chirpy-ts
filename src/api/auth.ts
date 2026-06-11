import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, makeJWT } from "../auth.js";
import { respondWithJSON } from "./json.js";
import { BadRequestError, UserNotAuthenticatedError } from "./errors.js";

import { Request, Response } from "express";
import { UserResponse } from "../db/schema.js";
import { config } from "../config.js";

type LoginResponse = UserResponse & {
    token: string;
};

export async function handlerLogin(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
        expiresInSeconds?: number;
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
    
    let duration = config.jwt.defaultDuration;
    if (params.expiresInSeconds && !(params.expiresInSeconds > config.jwt.defaultDuration)) {
        duration = params.expiresInSeconds;
    }

    const accessToken = makeJWT(user.id, duration, config.jwt.secret);

    respondWithJSON(res, 200, {
        id: user.id, 
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token: accessToken
    } satisfies LoginResponse);
}