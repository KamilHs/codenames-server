require('dotenv').config();

import express, { Application } from 'express';
import socketIO, { Server } from 'socket.io';

import sequelize from './config/db';
// import User from './models/User';

export const app: Application = express();
export const io: Server = new socketIO.Server();

const server = require('http').createServer(app);

sequelize.sync();

io.listen(server);
server.listen(process.env.PORT || 5000);
