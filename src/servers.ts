import dotenv from 'dotenv';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import socketIO, { Server } from 'socket.io';

dotenv.config();

export const app: Application = express();
export const io: Server = new socketIO.Server();
const server = require('http').createServer(app);

app.use(
    cors({
        origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
        credentials: true
    })
);
app.use(helmet());

io.listen(server);
server.listen(process.env.PORT || 5000);
