import { Request, Response } from "express";
import { config } from "../config.js";
import { UserForbiddenError } from "./errors.js";
import { reset } from "../db/queries/users.js";

export async function handlerReset(_: Request, res: Response) {
    if (config.api.platform !== "dev") {
        console.log(config.api.platform);
        throw new UserForbiddenError("Reset is only allowed in dev environment.");
    }
    await reset();
    console.log("Database reset successfully!");

    config.api.fileserverHits = 0;
    res.send("Hits reset to 0");
    res.end();
}