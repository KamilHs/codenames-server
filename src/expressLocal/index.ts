import cors from 'cors';
import helmet from 'helmet';
import express, { NextFunction, Request, Response } from 'express';

import { app } from '../servers';
import authRoutes from './routes/auth';
import { AUTH_PREFIX } from './routes/auth/const';
import passport from '../config/passport-setup';
import { response } from '../utils/response';
import { ResponseError } from 'expressLocal/const';

app.use(
    cors({
        origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
        credentials: true
    })
);
app.use(helmet());
app.use(express.json());

app.use(passport.initialize());

app.get('/', (req, res, next) => {
    res.locals.data = 'hello world';
    next();
});

app.use(AUTH_PREFIX, authRoutes);

// Middleware which formats the response and sends it to the user
app.use((req, res) => {
    const { data, error } = res.locals;
    res.json(response(data, error));
});

// Error handling middleware
app.use(
    (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
        res.json(
            response(false, {
                message: err.message,
                status: err.status,
                errors: err.errors
            })
        );
    }
);

export default app;
