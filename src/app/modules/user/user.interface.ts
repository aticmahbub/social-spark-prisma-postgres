export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
    role?: 'USER' | 'HOST' | 'ADMIN';
    bio?: string | null;
    image?: string | null;
    location?: string | null;
}
