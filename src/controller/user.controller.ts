import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { User } from '../entity/user.entity';
import bcryptjs from 'bcryptjs';

export const Users = async (req: Request, res: Response) => {
    try {
        const per_page = parseInt((req.query.per_page as string) || '10');
        const page = parseInt((req.query.page as string) || '1');

        const repo = getManager().getRepository(User);

        const [data, total] = await repo.findAndCount({
            take: per_page,
            skip: (page - 1) * per_page,
            relations: ['role'],
        });

        res.send({
            data: data.map((u) => {
                const { password, ...data } = u;
                return data;
            }),
            meta: {
                total,
                page,
                per_page,
                last_page: Math.ceil(total / per_page),
            },
        });
    } catch (e) {
        res.status(400).send(e);
    }
};

export const CreateUser = async (req: Request, res: Response) => {
    try {
        const { role_id, ...body } = req.body;
        const hashedPassword = await bcryptjs.hash('pw1234', 10);

        const repo = getManager().getRepository(User);

        const { password, ...user } = await repo.save({
            ...body,
            password: hashedPassword,
            role: { id: role_id },
        });

        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
};

export const GetUser = async (req: Request, res: Response) => {
    try {
        const repo = getManager().getRepository(User);

        const { password, ...user } = await repo.findOne(req.params.id, { relations: ['role'] });

        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
};

export const UpdateUser = async (req: Request, res: Response) => {
    try {
        const { role_id, ...body } = req.body;
        const repo = getManager().getRepository(User);

        await repo.update(req.params.id, {
            ...body,
            role: {
                id: role_id,
            },
        });

        const { password, ...user } = await repo.findOne(req.params.id, { relations: ['role'] });

        res.status(202).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
};

export const DeleteUser = async (req: Request, res: Response) => {
    try {
        const repo = getManager().getRepository(User);

        await repo.delete(req.params.id);

        res.status(204).send(null);
    } catch (e) {
        res.status(400).send(e);
    }
};
