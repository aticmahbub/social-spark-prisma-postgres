import type {JwtPayload} from 'jsonwebtoken';
import {prisma} from '../../../lib/prisma.js';
import type {CreateEventInput} from './event.types.js';
import {Role} from '../../../generated/enums.js';
import {calculatePagination, type IOptions} from '../../utils/pagination.js';
import type {Prisma} from '../../../generated/client.js';
import {eventFilterableFields} from './event.constants.js';
import {fi} from 'zod/locales';
import type {equal} from 'assert';

const createEvent = async (user: JwtPayload, data: CreateEventInput) => {
    if (user.role !== Role.HOST) {
        throw new Error('Only hosts can create events');
    }

    const event = await prisma.event.create({
        data: {
            ...data,
            host: {
                connect: {id: user.id},
            },
        },
    });

    return event;
};

const getEvents = async (filters: any, options: IOptions) => {
    const {page, limit, skip, sortBy, sortOrder} = calculatePagination(options);
    const {search, ...filterData} = filters;

    const andConditions: Prisma.EventWhereInput[] = [];

    if (search) {
        andConditions.push({
            OR: eventFilterableFields.map((field) => ({
                [field]: {contains: search, mode: 'insensitive'},
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {equals: (filterData as any)[key]},
            })),
        });
    }

    const whereConditions: Prisma.EventWhereInput =
        andConditions.length > 0 ? {AND: andConditions} : {};

    const result = await prisma.event.findMany({
        skip,
        take: limit,
        where: {AND: andConditions},
        orderBy: {[sortBy]: sortOrder},
    });

    const total = await prisma.event.count({
        where: whereConditions,
    });

    return {
        data: result,
        meta: {
            page,
            limit,
            total,
        },
    };
};
export const EventService = {createEvent, getEvents};
