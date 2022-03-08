import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { Product } from '../entity/product.entity';

export const Products = async (req: Request, res: Response) => {
    try {
        const per_page = parseInt((req.query.per_page as string) || '10');
        const page = parseInt((req.query.page as string) || '1');

        const repo = getManager().getRepository(Product);

        const [data, total] = await repo.findAndCount({
            take: per_page,
            skip: (page - 1) * per_page,
        });

        res.send({
            data,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / per_page),
            },
        });
    } catch (e) {
        res.status(400).send(e);
    }
};

export const CreateProduct = async (req: Request, res: Response) => {
    try {
        const repo = getManager().getRepository(Product);

        const product = await repo.save(req.body);

        res.status(201).send(product);
    } catch (e) {
        res.status(400).send(e);
    }
};

export const GetProduct = async (req: Request, res: Response) => {
    try {
        const repo = getManager().getRepository(Product);

        const product = await repo.findOne(req.params.id);

        res.send(product);
    } catch (e) {
        res.status(400).send(e);
    }
};

export const UpdateProduct = async (req: Request, res: Response) => {
    try {
        const repo = getManager().getRepository(Product);

        await repo.update(req.params.id, req.body);

        const product = await repo.findOne(req.params.id);

        res.status(202).send(product);
    } catch (e) {
        res.status(400).send(e);
    }
};

export const DeleteProduct = async (req: Request, res: Response) => {
    try {
        const repo = getManager().getRepository(Product);

        await repo.delete(req.params.id);

        res.status(204).send(null);
    } catch (e) {
        res.status(400).send(e);
    }
};
