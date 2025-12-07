import {envVars} from '../../../config/index.js';
import AppError from '../../../errorHelpers/appError.js';
import {prisma} from '../../../lib/prisma.js';
import bcrypt from 'bcryptjs';
import type {CreateUserInput} from './user.interface.js';
import type {Request} from 'express';
import {fileUploader} from '../../utils/fileUploader.js';

const createUser = async (req: Request) => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.image = uploadResult?.secure_url;
    }

    const existingUser = await prisma.user.findUnique({
        where: {email: req.body.email},
    });

    if (existingUser) {
        throw new AppError(409, 'Email already exists');
    }

    const salt = Number(envVars.BCRYPTJS_SALT_ROUND) || 10;

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = await prisma.user.create({
        data: {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role ?? 'USER',
            bio: req.body.bio ?? null,
            image: req.body.image ?? null,
            location: req.body.location ?? null,
        },
    });

    const {password, ...safeUser} = user;

    return safeUser;
};

export const UserService = {createUser};
