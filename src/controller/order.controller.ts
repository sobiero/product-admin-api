import { Request, Response } from 'express';
import { Parser } from 'json2csv';
import { getManager } from 'typeorm';
import { OrderItem } from '../entity/order-item.entity';
import { Order } from '../entity/order.entity';

export const Orders = async (req: Request, res: Response) => {
    try {
        const per_page = parseInt((req.query.per_page as string) || '10');
        const page = parseInt((req.query.page as string) || '1');

        const repo = getManager().getRepository(Order);

        const [data, total] = await repo.findAndCount({
            take: per_page,
            skip: (page - 1) * per_page,
            relations: ['order_items'],
        });

        res.send({
            data: data.map((order: Order) => ({
                id: order.id,
                name: order.full_name,
                email: order.email,
                total: order.total,
                created_at: order.created_at,
                order_items: order.order_items,
            })),

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

export const Export = async (req: Request, res: Response) => {
    try {
        const parser = new Parser({
            fields: ['ID', 'Name', 'Email', 'Product Title', 'Price', 'Quantity'],
        });

        const repo = getManager().getRepository(Order);

        const orders = await repo.find({
            relations: ['order_items'],
        });

        const json = [];

        orders.forEach((order: Order) => {
            json.push({
                ID: order.id,
                Name: order.full_name,
                Email: order.email,
                'Product Title': '',
                Price: '',
                Quantity: '',
            });

            order.order_items.forEach((item: OrderItem) => {
                json.push({
                    ID: '',
                    Name: '',
                    Email: '',
                    'Product Title': item.product_title,
                    Price: item.price,
                    Quantity: item.quantity,
                });
            });
        });

        const csv = parser.parse(json);

        res.header('Contennt-Type', 'text/csv');
        res.attachment('orders.csv');
        res.send(csv);
    } catch (e) {
        res.status(400).send(e);
    }
};

export const Chart = async (req: Request, res: Response) => {
    try {
        const mgr = getManager();

        const rslt = await mgr.query(`
        SELECT 
            DATE ( o.created_at ) AS date,
            SUM ( oi.price * oi.quantity ) AS SUM 
        FROM
            node_admin."order" o
            JOIN node_admin.order_item oi ON o.ID = oi.order_id 
        GROUP BY
        date
    `);

        res.send(rslt);
    } catch (e) {
        res.status(400).send(e);
    }
};
