import { createConnection, getManager } from 'typeorm';
import { User } from '../entity/user.entity';
import faker from 'faker';
import bcryptjs from 'bcryptjs';
import { randomInt } from 'crypto';

createConnection().then(async (conn) => {
    const repo = getManager().getRepository(User);

    var fname: string, lname: string;

    for (let i = 0; i < 30; i++) {
        fname = faker.name.firstName();
        lname = faker.name.lastName();

        await repo.save({
            first_name: fname,
            last_name: lname,
            email: faker.internet.email(fname, lname).toLocaleLowerCase(),
            password: await bcryptjs.hash('pw1234', 10),
            role: { id: randomInt(1, 4) },
        });
    }
    process.exit(0);
});
