import { Router } from 'express';
import { checkSchema } from 'express-validator';

import { loginSchema, registerSchema } from '../../schema/auth';
import AuthControllers from '../../controllers/auth';
import { AUTH_ROUTES } from './const';

const router = Router();

router.post(AUTH_ROUTES.login, checkSchema(loginSchema), AuthControllers.login);
router.post(
    AUTH_ROUTES.register,
    checkSchema(registerSchema),
    AuthControllers.register
);

export default router;
