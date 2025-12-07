import bcrypt from 'bcryptjs';
import {prisma} from '../../../../lib/prisma.js';
import AppError from '../../../../errorHelpers/appError.js';

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
};

export const AuthService = {loginUser};
