/* eslint-disable prefer-promise-reject-errors */
import { ParamSchema } from 'express-validator';

import User from '../../models/User';

export const loginSchema: Record<string, ParamSchema> = {
    email: {
        in: 'body',
        notEmpty: true,
        trim: true,
        errorMessage: 'Email is required',
        normalizeEmail: true
    },
    password: {
        in: 'body',
        notEmpty: true,
        trim: true,
        isLength: {
            errorMessage: 'Password must be at least 8 characters',
            options: {
                min: 8
            }
        },
        custom: {
            options: async (password, { req }) => {
                const { email } = req.body;
                if (!email) return false;
                const verified = await User.findAndVerifyPassword(
                    { where: { email } },
                    password
                );
                if (!verified) {
                    return Promise.reject();
                }
            },
            errorMessage: 'Invalid password or email'
        }
    }
};

export const registerSchema: Record<string, ParamSchema> = {
    username: {
        in: 'body',
        notEmpty: true,
        isAlphanumeric: true,
        trim: true,
        errorMessage: 'Username is required'
    },
    email: {
        in: 'body',
        notEmpty: true,
        trim: true,
        errorMessage: 'Email is required',
        normalizeEmail: true,
        custom: {
            options: async (email: string) => {
                const user = await User.findOne({
                    where: { email }
                });
                if (user) {
                    return Promise.reject();
                }
            },
            errorMessage: 'Email is already used'
        }
    },
    password: {
        in: 'body',
        notEmpty: true,
        trim: true,
        isLength: {
            errorMessage: 'Password must be at least 8 characters',
            options: {
                min: 8
            }
        }
    },
    confirmPassword: {
        in: 'body',
        notEmpty: true,
        trim: true,
        isLength: {
            errorMessage: 'Password must be at least 8 characters',
            options: {
                min: 8
            }
        },
        custom: {
            options: (value, { req }) => {
                const { password } = req.body;
                return password === value;
            },
            errorMessage: 'Passwords must match'
        }
    }
};
