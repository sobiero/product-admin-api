import { createConnection, getManager } from 'typeorm';
import { Product } from '../entity/product.entity';
import faker from 'faker';

createConnection().then(async (conn) => {
    const repo = getManager().getRepository(Product);

    for (let i = 0; i < 30; i++) {
        await repo.save({
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            image: faker.image.imageUrl(200, 200, 'products', true),
            price: faker.commerce.price(10, 100, 2),
        });
    }

    process.exit(0);
});
