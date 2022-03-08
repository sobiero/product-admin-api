import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { Role } from '../entity/role.entity';
//import { Permission } from '../entity/permission.entity';

export const Roles = async (req: Request, res: Response) => {
    try {
        const repo = getManager().getRepository(Role);

        res.send(await repo.find());
    } catch (e) {
        res.status(400).send(e);
    }
};

export const GetRole = async (req: Request, res: Response) => {
    try {
        const repo = getManager().getRepository(Role);

        const role = await repo.findOne(req.params.id, { relations: ['permissions'] });

        res.send(role);
    } catch (e) {
        res.status(400).send(e);
    }
};

export const CreateRole = async (req: Request, res: Response) => {
    try {
        const { name, permissions } = req.body;

        const repo = getManager().getRepository(Role);

        const role = await repo.save({ name, permissions: permissions.map((id: number) => ({ id })) });

        res.status(201).send(role);
    } catch (e) {
        res.status(400).send(e);
    }
};

export const UpdateRole = async (req: Request, res: Response) => {
    try {
        const { name, permissions } = req.body;

        const repo = getManager().getRepository(Role);
        //const permsRepo = getManager().getRepository(Permission);
        const role = await repo.save({
            id: parseInt(req.params.id),
            name,
            permissions: permissions.map((id: number) => ({ id })),
        });

        res.status(202).send(role);
    } catch (e) {
        res.status(400).send(e);
    }
};

export const DeleteRole = async (req: Request, res: Response) => {
    try {
        const repo = getManager().getRepository(Role);

        await repo.delete(req.params.id);

        res.status(204).send(null);
    } catch (e) {
        res.status(400).send(e);
    }
};
