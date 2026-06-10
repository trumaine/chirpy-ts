import { Request, Response } from "express";

import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { hashPassword } from "../auth.js";
import { UserResponse } from "../db/schema.js";

export async function handlerCreateUser(req: Request, res: Response) {
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