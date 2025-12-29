import bcrypt from 'bcryptjs';
import jwt, {type SignOptions} from 'jsonwebtoken';
import {prisma} from '../../../lib/prisma.js';
import AppError from '../../../errorHelpers/appError.js';
import {generateToken} from '../../utils/jwt.js';
import {envVars} from '../../../config/index.js';
import {createUserTokens} from '../../utils/userTokens.js';

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

    if (user.isDeleted) {
        throw new AppError(410, 'User is deleted');
    }

    const userTokens = createUserTokens(user);

    const userWithoutPassword = {...user, password: undefined};

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: userWithoutPassword,
    };
};

export const AuthService = {loginUser};
