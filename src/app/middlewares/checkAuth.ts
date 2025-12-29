import type {NextFunction, Request, Response} from 'express';
import {verifyToken} from '../utils/jwt.js';
import {envVars} from '../../config/index.js';
import type {JwtPayload} from 'jsonwebtoken';
import {prisma} from '../../lib/prisma.js';
import AppError from '../errorHelpers/appError.js';

export const checkAuth =
    (...authRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessToken =
                req.headers.authorization || req.cookies.accessToken;

            if (!accessToken) {
                throw new AppError(401, 'No Token received');
            }

            const verifiedToken = verifyToken(
                accessToken,
                envVars.JWT.JWT_ACCESS_SECRET,
            ) as JwtPayload;

            const isUserExist = await prisma.user.findUnique({
                where: {email: verifiedToken.email},
            });

            if (!isUserExist) {
                throw new AppError(404, 'User does not exist');
            }

            if (isUserExist.isDeleted) {
                throw new AppError(410, 'User is deleted');
            }

            if (!authRoles.includes(verifiedToken.role)) {
                throw new AppError(
                    403,
                    'You are not permitted to view this route!!!',
                );
            }
            req.user = verifiedToken;
            next();
        } catch (error) {
            console.log('jwt error', error);
            next(error);
        }
    };
