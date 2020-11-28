import { Request, Response } from "express";
import { getRepository } from "typeorm";

import User from "../models/User";
import { createToken } from "./AuthController";

class UserController {
    index (req: Request, res: Response){
        return res.send('Eae');
    }

    async store(req: Request, res: Response) {
        const repository = getRepository( User );
        const { name, email, password } = req.body;
        
        const userExists = await repository.findOne({ where: { email } });

        if( userExists ) {
            return res.status(409).send({ error: 'User already exist!' });
        }

        const user = repository.create({ name, email, password });
        await repository.save( user );

        const token = createToken({ id: user.id });
        return res.json({ user, token });
    }
}

export default new UserController();