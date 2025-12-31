import {envVars} from '../../../config/index.js';
import AppError from '../../errorHelpers/appError.js';
import {prisma} from '../../../lib/prisma.js';
import bcrypt from 'bcryptjs';
import type {Request} from 'express';
import {fileUploader} from '../../utils/fileUploader.js';
import {calculatePagination, type IOptions} from '../../utils/pagination.js';
import {userSearchableFields} from './user.constants.js';
import {Role, type Prisma} from '../../../generated/client.js';
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
        omit: {password: true},
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
            joinedEvents: user.role === Role.USER ? true : false,
            hostedEvents: user.role === Role.HOST ? true : false,
        },
    });

    if (!profile) {
        throw new Error('User not found');
    }

    return profile;
};

// For hosts with ratings
const getHostProfileWithRating = async (user: JwtPayload, id: string) => {
    console.log(id);
    const profile = await prisma.user.findUnique({
        where: {id},
        select: {
            id: true,
            name: true,
            image: true,
            bio: true,
            location: true,
            role: true,
            receivedReviews: {
                select: {rating: true},
            },
        },
    });

    if (!profile) throw new Error('User not found');

    const totalReviews = profile.receivedReviews.length;
    const avgRating =
        totalReviews === 0
            ? 0
            : profile.receivedReviews.reduce((a, b) => a + b.rating, 0) /
              totalReviews;

    return {
        ...profile,
        averageRating: Number(avgRating.toFixed(1)),
        totalReviews,
        receivedReviews: undefined,
    };
};

const getPublicHostProfileWithEvents = async (hostId: string) => {
    const host = await prisma.user.findUnique({
        where: {id: hostId},
        select: {
            id: true,
            name: true,
            image: true,
            bio: true,
            location: true,
            hostedEvents: true,
            receivedReviews: {
                select: {
                    rating: true,
                    comment: true,
                    createdAt: true,
                    reviewer: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                },
            },
        },
    });

    if (!host) throw new Error('Host not found');

    const totalReviews = host.receivedReviews.length;
    const avgRating =
        totalReviews === 0
            ? 0
            : host.receivedReviews.reduce((a, b) => a + b.rating, 0) /
              totalReviews;

    return {
        ...host,
        averageRating: Number(avgRating.toFixed(1)),
        totalReviews,
    };
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

export const UserService = {
    createUser,
    getAllUsers,
    getProfile,
    updateProfile,
    getHostProfileWithRating,
    getPublicHostProfileWithEvents,
};
