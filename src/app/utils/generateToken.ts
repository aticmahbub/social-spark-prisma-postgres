import type {JwtPayload, Secret, SignOptions} from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

export const generateToken = (
    payload: JwtPayload,
    secret: Secret,
    expiresIn: string,
) => {
    const token = jwt.sign(payload, String(secret), {
        algorithm: 'HS256',
        expiresIn: String(expiresIn),
    } as SignOptions);

    return token;
};
