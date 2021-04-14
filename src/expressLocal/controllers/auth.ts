import { NextFunction, Request, Response } from 'express';

import User from '../../models/User';
import { checkValidation } from '../../utils/validator';

export default {
    login: async (req: Request, res: Response, next: NextFunction) => {},
    register: async (req: Request, res: Response, next: NextFunction) => {
        if (!checkValidation(req, next)) {
            return;
        }
        const { email, password, username } = req.body;
        try {
            const user = await User.create({
                username,
                email,
                password
            });

            await user.save();

            res.locals.data = {
                success: true,
                message: 'User created successfully'
            };

            next();
        } catch (err) {
            next(err);
        }
    }
};
