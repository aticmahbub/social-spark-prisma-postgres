import {envVars} from '../../config/index.js';
import type {User} from '../../generated/client.js';
import {generateToken} from './jwt.js';

export const createUserTokens = (user: Partial<User>) => {
    const jwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    const accessToken = generateToken(
        jwtPayload,
        envVars.JWT.JWT_ACCESS_SECRET,
        envVars.JWT.JWT_ACCESS_EXPIRES,
    );
    const refreshToken = generateToken(
        jwtPayload,
        envVars.JWT.JWT_REFRESH_SECRET,
        envVars.JWT.JWT_REFRESH_EXPIRES,
    );
    return {accessToken, refreshToken};
};
