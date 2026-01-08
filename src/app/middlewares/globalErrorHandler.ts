import type {Request, Response, NextFunction} from 'express';
import AppError from '../errorHelpers/appError.js';

const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction,
) => {
    let statusCode = 500;
    let message = 'Something went wrong';

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    if (err?.code === 'P2025') {
        statusCode = 404;
        message = 'Resource not found';
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
        }),
    });
};

export default globalErrorHandler;
