import { Request, Response } from "express";
import { getRepository } from "typeorm";

import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

import User from "../models/User";

interface TokenPayload {
    id: string;
    iat: number;
    exp: number;
}

export const createToken = (data) => {
    return jwt.sign(data, process.env.SECRET_API, { expiresIn: '1d' });
};

class AuthController {
    async authenticate(req: Request, res: Response) {
        const repository = getRepository( User );
        const { email, password } = req.body;
        
        const user = await repository.findOne({ where: { email } });

        if( !user ) {
            return res.status(401).json({ error: "Unauthorized." });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if( !isValidPassword ) {
            return res.status(401).json({ error: "Email or password not is correct." });
        }
        
        const token = createToken({ id: user.id });
        delete user.password;

        return res.json({ user, token });
    }

    async refresh(req: Request, res: Response) {
        if ( !req.body.token ) {
            return res.status(401).send({ error: "Unauthorized." });
        }

        let token = req.body.token;
        const data = jwt.verify(token, process.env.SECRET_API);
        const { id } = data as TokenPayload;
        
        const repository = getRepository( User );
        const user = await repository.findOne({ where: {id} });

        if ( !user ) {
            return res.status(401).send({ error: "Unauthorized." });
        } else {
            const token = createToken({ id: user.id });
            delete user.password;

            return res.json({ user, token });
        }
    }
}

export default new AuthController();