import { NextFunction, Request } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';

import { ResponseError } from 'expressLocal/const';

export const transformValidationError = (result: Result<ValidationError>) => {
    const error = <ResponseError> new Error();
    const errors = result.array({ onlyFirstError: true });
    error.errors = errors.map(err => ({ [err.param]: err.msg }));
    return error;
};

export const checkValidation = (req: Request, next: NextFunction) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        next(transformValidationError(result));
        return false;
    }
    return true;
};
