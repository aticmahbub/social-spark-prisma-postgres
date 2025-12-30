import {envVars} from '../../../config/index.js';
import AppError from '../../errorHelpers/appError.js';
import {prisma} from '../../../lib/prisma.js';
import bcrypt from 'bcryptjs';
import type {Request} from 'express';
import {fileUploader} from '../../utils/fileUploader.js';
import {calculatePagination, type IOptions} from '../../utils/pagination.js';
import {userSearchableFields} from './user.constants.js';
import type {Prisma} from '../../../generated/client.js';
import type {JwtPayload} from 'jsonwebtoken';

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
            role: req.body.role,
            bio: req.body.bio ?? null,
            image: req.body.image ?? null,
            location: req.body.location ?? null,
        },
    });

    const {password, ...safeUser} = user;

    return safeUser;
};

const getAllUsers = async (params: any, options: IOptions) => {
    const {page, limit, skip, sortBy, sortOrder} = calculatePagination(options);
    const {searchTerm, ...filterData} = params;

    const andConditions: Prisma.UserWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    const whereConditions: Prisma.UserWhereInput =
        andConditions.length > 0
            ? {
                  AND: andConditions,
              }
            : {};

    const result = await prisma.user.findMany({
        skip,
        take: limit,

        where: whereConditions,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });

    const total = await prisma.user.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

const getProfile = async (user: JwtPayload) => {
    const profile = await prisma.user.findUnique({
        where: {
            id: user.id,
            isDeleted: false,
        },
        select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            image: true,
            location: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!profile) {
        throw new Error('User not found');
    }

    return profile;
};

const updateProfile = async (req: Request, user: JwtPayload & {id: string}) => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.image = uploadResult?.secure_url;
    }

    const allowedFields = ['name', 'bio', 'image', 'location'];

    const updateData: Record<string, any> = {};

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
        }
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: user.id,
            isDeleted: false,
        },
        data: updateData,
        select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            image: true,
            location: true,
            role: true,
            updatedAt: true,
        },
    });

    return updatedUser;
};

export const UserService = {createUser, getAllUsers, getProfile, updateProfile};
