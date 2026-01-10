import type {NextFunction, Request, Response} from 'express';
import {envVars} from '../../config/index.js';
import type {TErrorSources} from '../../interfaces/error.types.js';
import {Prisma} from '../../generated/client.js';
import AppError from '../errorHelpers/appError.js';
import {handlerZodError} from '../utils/handleZodError.js';

/**
 * Prevent exposing sensitive DB errors in production
 */
const sanitizeError = (error: any) => {
    if (
        envVars.NODE_ENVIRONMENT === 'production' &&
        error?.code?.startsWith('P')
    ) {
        return null;
    }
    return error;
};

const globalErrorHandler = async (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (envVars.NODE_ENVIRONMENT === 'development') {
        console.error(err);
    }

    let statusCode = 500;
    let message = 'Something went wrong!';
    let errorSources: TErrorSources[] = [];
    let error: any = err;

    /**
     * 🔹 Zod validation error
     */
    if (err?.name === 'ZodError') {
        const simplifiedError = handlerZodError(err);
        statusCode = simplifiedError.statusCode; // usually 400
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources as TErrorSources[];
    } else if (err instanceof Prisma.PrismaClientValidationError) {
        /**
         * 🔹 Prisma validation error
         */
        statusCode = 400;
        message = 'Validation Error';
        error = err.message;
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        /**
         * 🔹 Prisma known request errors
         */
        if (err.code === 'P2002') {
            statusCode = 409;
            message = 'Duplicate value error';
            error = err.meta;
        } else {
            statusCode = 400;
            message = 'Database request error';
            error = err.message;
        }
    } else if (err instanceof AppError) {
        /**
         * 🔹 Custom AppError
         */
        statusCode = err.statusCode;
        message = err.message;
    } else if (err instanceof Error) {
        /**
         * 🔹 Generic JS error
         */
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        error: sanitizeError(error),
        stack: envVars.NODE_ENVIRONMENT === 'development' ? err.stack : null,
    });
};

export default globalErrorHandler;
