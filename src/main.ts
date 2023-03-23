import config from './config';
import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import { CdInit } from './CdApi/init';

export class Main {
    run() {
        const app = express();
        const port = config.apiPort;
        const options: cors.CorsOptions = config.Cors.options;

        app.use(cors());
        // app.use(cors(options));
        // app.options('*:*', cors(options)); // enable pre-flight

        app.post('/', async (req: any, res: any) => {
            res.setHeader('Content-Type', 'application/json');
            CdInit(req, res);
        });

        app.listen(port, () => {
            console.log(`server is listening on ${port}`);
        })
            .on('error', (e) => {
                console.log(`app.listen()/Error:${e}`);
            });
    }

}