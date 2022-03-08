require('dotenv').config();

import express from 'express';
import cors from 'cors';
import { routes } from './routes';
import { createConnection } from 'typeorm';
import cookieParser from 'cookie-parser';

createConnection().then((conn) => {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());

    app.use(
        cors({
            credentials: true,
            origin: ['http://192.168.110.110:3000', 'http://localhost:3000'],
        })
    );

    //app.options('*', cors()) ;

    routes(app);

    app.listen(8000, () => {
        console.log('listening on port 8000');
    });
});
