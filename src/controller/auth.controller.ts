import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { User } from '../entity/user.entity';
import { RegisterValidation } from '../validation/register.validation';
import bcryptjs from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

export const Register = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        //const validation = RegisterValidation.validate(body);

        const { error } = RegisterValidation.validate(body);

        if (error) {
            return res.status(400).send(error.details);
        }

        if (body.password !== body.password_confirm) {
            return res.status(400).send({ message: 'Passwords do not match' });
        }

        const repo = getManager().getRepository(User);

        const { password, ...user } = await repo.save({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: await bcryptjs.hash(body.password, 10),
        });

        res.send(user);
    } catch (e) {
        res.send({ error: e.driverError?.detail });
    }
};

export const Login = async (req: Request, res: Response) => {
    const repo = getManager().getRepository(User);

    const user = await repo.findOne({ email: req.body.email });

    if (!user) {
        // return res.status(404).send( { message: "User not found"} )
        return res.status(400).send({ message: 'Invalid credentials' });
    }

    if (!(await bcryptjs.compare(req.body.password, user.password))) {
        return res.status(400).send({ message: 'Invalid credentials' });
    }

    const payload = { id: user.id, email: user.email };

    const token = sign(payload, process.env.JWT_SECRET_KEY);

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    const { password, ...data } = user;

    res.send({ message: 'success' });
};

export const AuthenticatedUser = async (req: Request, res: Response) => {
    const { password, ...user } = req['user'];
    res.status(200).send(user);
};

export const Logout = async (req: Request, res: Response) => {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).send({ message: 'success' });
};

export const UpdateInfo = async (req: Request, res: Response) => {
    const user = req['user'];

    const repo = getManager().getRepository(User);

    await repo.update(user.id, req.body);

    const { password, ...data } = await repo.findOne(user.id);

    res.send(data);
};

export const UpdatePassword = async (req: Request, res: Response) => {
    const user = req['user'];

    if (req.body.password !== req.body.password_confirm) {
        return res.status(400).send({ message: 'Passwords do not match' });
    }

    const repo = getManager().getRepository(User);

    await repo.update(user.id, { password: await bcryptjs.hash(req.body.password, 10) });

    const { password, ...data } = user.id;

    res.send(data);
};
