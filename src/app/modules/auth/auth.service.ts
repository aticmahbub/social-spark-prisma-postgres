import bcrypt from 'bcryptjs';
import AppError from '../../errorHelpers/appError.js';
import {createUserTokens} from '../../utils/userTokens.js';
import {prisma} from '../../../lib/prisma.js';
import {generateToken, verifyToken} from '../../utils/jwt.js';
import {envVars} from '../../../config/index.js';
import type {JwtPayload, Secret} from 'jsonwebtoken';

// const loginUser = async (payload: {email: string; password: string}) => {
//     const user = await prisma.user.findUniqueOrThrow({
//         where: {email: payload.email},
//     });

//     const isCorrectPassword = await bcrypt.compare(
//         payload.password,
//         user.password,
//     );

//     if (!isCorrectPassword) {
//         throw new AppError(404, 'Password is not correct');
//     }

//     if (user.isDeleted) {
//         throw new AppError(410, 'User is deleted');
//     }

//     const userTokens = createUserTokens(user);

//     const userWithoutPassword = {...user, password: undefined};

//     return {
//         accessToken: userTokens.accessToken,
//         refreshToken: userTokens.refreshToken,
//         user: userWithoutPassword,
//     };
// };

const loginUser = async (payload: {email: string; password: string}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
        },
    });

    const isCorrectPassword: boolean = await bcrypt.compare(
        payload.password,
        userData.password,
    );

    if (!isCorrectPassword) {
        throw new Error('Password incorrect!');
    }
    const accessToken = generateToken(
        {
            email: userData.email,
            role: userData.role,
        },
        envVars.JWT.JWT_ACCESS_SECRET as Secret,
        envVars.JWT.JWT_ACCESS_EXPIRES as string,
    );

    const refreshToken = generateToken(
        {
            email: userData.email,
            role: userData.role,
        },
        envVars.JWT.JWT_REFRESH_SECRET as Secret,
        envVars.JWT.JWT_REFRESH_EXPIRES as string,
    );

    return {
        accessToken,
        refreshToken,
    };
};
const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = verifyToken(
            token,
            envVars.JWT.JWT_REFRESH_SECRET,
        ) as JwtPayload;
    } catch (err) {
        throw new AppError(502, 'Your are not authorized');
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {email: decodedData.email, isDeleted: false},
    });

    const accessToken = createUserTokens({
        email: userData.email,
        role: userData.role,
        id: userData.id,
    });

    return {accessToken};
};
export const AuthService = {loginUser, refreshToken};
