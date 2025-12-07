import bcrypt from 'bcryptjs';
import {prisma} from '../../../../lib/prisma.js';
import AppError from '../../../../errorHelpers/appError.js';
import jwt, {type SignOptions} from 'jsonwebtoken';
import {envVars} from '../../../../config/index.js';
import {generateToken} from '../../../utils/generateToken.js';

const loginUser = async (payload: {email: string; password: string}) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {email: payload.email},
    });

    const isCorrectPassword = await bcrypt.compare(
        payload.password,
        user.password,
    );

    if (!isCorrectPassword) {
        throw new AppError(404, 'Password is not correct');
    }

    const accessToken = generateToken(
        {email: user.email, role: user.role},
        envVars.JWT.JWT_ACCESS_SECRET,
        envVars.JWT.JWT_ACCESS_EXPIRES,
    );
    const refreshToken = generateToken(
        {email: user.email, role: user.role},
        envVars.JWT.JWT_REFRESH_SECRET,
        envVars.JWT.JWT_REFRESH_EXPIRES,
    );
    return {accessToken, refreshToken};
};

export const AuthService = {loginUser};
