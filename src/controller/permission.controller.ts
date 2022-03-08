import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { Permission } from '../entity/permission.entity';

export const Permissions = async (req: Request, res: Response) => {
    try {
        const repo = getManager().getRepository(Permission);

        res.send(await repo.find());
    } catch (e) {
        res.status(400).send(e);
    }
};
