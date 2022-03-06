import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { getManager } from 'typeorm';
import { User } from '../entity/user.entity';

export const AuthMiddleware = async (req: Request, res: Response, next: Function) => {
    try {
        const jwt = req.cookies['jwt'];

        // if(!jwt){
        //     return res.status(401).send( { message: "unauthenticated!"} ) ;
        // }

        const payload: any = verify(jwt, process.env.JWT_SECRET_KEY);

        if (!payload) {
            return res.status(401).send({ message: 'unauthenticated' });
        }

        const repo = getManager().getRepository(User);

        req['user'] = await repo.findOne({ email: payload.email }, { relations: ['role', 'role.permissions'] });

        next();
    } catch (e) {
        return res.status(401).send({ message: 'unauthenticated' });
    }
};
