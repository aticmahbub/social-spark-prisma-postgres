export type CreateEventInput = {
    name: string;
    type: string;
    description: string;
    date: Date;
    location: string;
    minParticipants: number;
    maxParticipants: number;
    image?: string;
    joiningFee?: number;
};
