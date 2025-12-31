import type {JwtPayload} from 'jsonwebtoken';
import {prisma} from '../../../lib/prisma.js';

const createReview = async (
    user: JwtPayload & {id: string},
    payload: {
        eventId: string;
        rating: number;
        comment?: string;
    },
) => {
    const {eventId, rating, comment} = payload;

    if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
    }

    const event = await prisma.event.findUnique({
        where: {id: eventId},
        include: {
            participants: {
                where: {userId: user.id},
            },
        },
    });

    if (!event) {
        throw new Error('Event not found');
    }

    if (event.hostId === user.id) {
        throw new Error('Host cannot review own event');
    }

    if (event.date > new Date()) {
        throw new Error('You can only review after the event');
    }

    if (event.participants.length === 0) {
        throw new Error('You did not attend this event');
    }

    const review = await prisma.review.create({
        data: {
            rating,
            comment: comment || null,
            reviewerId: user.id,
            hostId: event.hostId,
            eventId,
        },
    });

    return review;
};

const getHostRating = async (hostId: string) => {
    const stats = await prisma.review.aggregate({
        where: {hostId},
        _avg: {
            rating: true,
        },
        _count: {
            rating: true,
        },
    });

    return {
        averageRating: Number(stats._avg.rating?.toFixed(1)) || 0,
        totalReviews: stats._count.rating,
    };
};

export const ReviewService = {
    createReview,
    getHostRating,
};
