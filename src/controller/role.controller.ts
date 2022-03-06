import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { Role } from '../entity/role.entity';
//import { Permission } from '../entity/permission.entity';

export const Roles = async (req: Request, res: Response) => {
    const repo = getManager().getRepository(Role);

    res.send(await repo.find());
};

export const CreateRole = async (req: Request, res: Response) => {
    const { name, permissions } = req.body;

    const repo = getManager().getRepository(Role);

    const role = await repo.save({ name, permission: permissions.map((id) => ({ id })) });

    res.status(201).send(role);
};

export const GetRole = async (req: Request, res: Response) => {
    const repo = getManager().getRepository(Role);

    try {
        const role = await repo.findOne(req.params.id, { relations: ['permission'] });

        res.send(role);
    } catch (e) {
        res.send(e);
    }
};

export const UpdateRole = async (req: Request, res: Response) => {
    const { name, permissions } = req.body;

    const repo = getManager().getRepository(Role);

    //const permsRepo = getManager().getRepository(Permission);

    const role = await repo.save({ id: parseInt(req.params.id), name, permission: permissions.map((id) => ({ id })) });

    res.status(202).send(role);
};

export const DeleteRole = async (req: Request, res: Response) => {
    const repo = getManager().getRepository(Role);

    try {
        await repo.delete(req.params.id);

        res.status(204).send(null);
    } catch (e) {
        res.send(e);
    }
};
