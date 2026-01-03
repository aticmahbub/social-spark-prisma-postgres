import type { Request } from 'express';
import { type IOptions } from '../../utils/pagination.js';
import { Role } from '../../../generated/client.js';
import type { JwtPayload } from 'jsonwebtoken';
export declare const UserService: {
    createUser: (req: Request) => Promise<{
        createdAt: Date;
        email: string;
        role: Role;
        id: string;
        name: string;
        bio: string | null;
        image: string | null;
        location: string | null;
        isDeleted: boolean;
        updatedAt: Date;
    }>;
    getAllUsers: (params: any, options: IOptions) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        data: {
            createdAt: Date;
            email: string;
            role: Role;
            id: string;
            name: string;
            bio: string | null;
            image: string | null;
            location: string | null;
            isDeleted: boolean;
            updatedAt: Date;
        }[];
    }>;
    getProfile: (user: JwtPayload) => Promise<{
        createdAt: Date;
        email: string;
        role: Role;
        id: string;
        name: string;
        bio: string | null;
        image: string | null;
        location: string | null;
        updatedAt: Date;
        hostedEvents: {
            createdAt: Date;
            status: import("../../../generated/enums.js").EventStatus;
            id: string;
            name: string;
            image: string | null;
            location: string;
            updatedAt: Date;
            hostId: string;
            type: string;
            description: string;
            date: Date;
            minParticipants: number;
            maxParticipants: number;
            joiningFee: number;
        }[];
        joinedEvents: {
            status: import("../../../generated/enums.js").UserEventStatus;
            id: string;
            eventId: string;
            joinedAt: Date;
            userId: string;
        }[];
    }>;
    updateProfile: (req: Request, user: JwtPayload & {
        id: string;
    }) => Promise<{
        email: string;
        role: Role;
        id: string;
        name: string;
        bio: string | null;
        image: string | null;
        location: string | null;
        updatedAt: Date;
    }>;
    getHostProfileWithRating: (user: JwtPayload, id: string) => Promise<{
        averageRating: number;
        totalReviews: number;
        receivedReviews: undefined;
        role: Role;
        id: string;
        name: string;
        bio: string | null;
        image: string | null;
        location: string | null;
    }>;
    getPublicHostProfileWithEvents: (hostId: string) => Promise<{
        averageRating: number;
        totalReviews: number;
        id: string;
        name: string;
        bio: string | null;
        image: string | null;
        location: string | null;
        hostedEvents: {
            createdAt: Date;
            status: import("../../../generated/enums.js").EventStatus;
            id: string;
            name: string;
            image: string | null;
            location: string;
            updatedAt: Date;
            hostId: string;
            type: string;
            description: string;
            date: Date;
            minParticipants: number;
            maxParticipants: number;
            joiningFee: number;
        }[];
        receivedReviews: {
            createdAt: Date;
            rating: number;
            comment: string | null;
            reviewer: {
                name: string;
                image: string | null;
            };
        }[];
    }>;
};
//# sourceMappingURL=user.service.d.ts.map