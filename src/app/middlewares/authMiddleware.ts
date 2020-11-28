import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import jwt from 'jsonwebtoken';

import User from "../models/User";

interface TokenPayload {
    id: string;
    iat: number;
    exp: number;
}

export default async function authMiddleware (req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if( !authorization ) {
        return res.status(401).send({ error: "Unauthorized." });
    } else {
        const token = authorization.replace('Bearer', '').trim();

        try {
            const data = jwt.verify(token, process.env.SECRET_API);
            const { id } = data as TokenPayload;
            
            const repository = getRepository( User );
            const user = await repository.findOne({ where: {id} });

            if( !user ) {
                return res.status(401).send({ error: "Unauthorized." });
            }

            req.userId = id;
            
            return next();
        } catch {
            return res.status(403).send({ error: "Access denied." });
        }
    }
}