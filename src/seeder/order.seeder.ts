import { createConnection, getManager } from 'typeorm';
import faker from 'faker';
import { Order } from '../entity/order.entity';
import { randomInt } from 'crypto';
import { OrderItem } from '../entity/order-item.entity';

createConnection().then(async (conn) => {
    const orderRepo = getManager().getRepository(Order);
    const orderItemRepo = getManager().getRepository(OrderItem);

    var fname: string, lname: string;

    for (let i = 0; i < 30; i++) {
        fname = faker.name.firstName();
        lname = faker.name.lastName();

        const order = await orderRepo.save({
            first_name: fname,
            last_name: lname,
            email: faker.internet.email(fname, lname).toLocaleLowerCase(),
            created_at: faker.date.between('2021-01-01', '2022-02-28').toDateString(),
        });

        for (let j = 0; j < randomInt(1, 5); j++) {
            await orderItemRepo.save({
                order,
                product_title: faker.commerce.productName(),
                price: faker.commerce.price(10, 100, 2),
                quantity: randomInt(1, 5),
            });
        }
    }

    process.exit(0);
});
