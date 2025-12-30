export interface IOptions {
    page?: string | number;
    limit?: string | number;
    skip?: string | number;

    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface IPaginationResult {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}
export const calculatePagination = (options: IOptions): IPaginationResult => {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const skip = Number(page - 1) * limit;

    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';

    return {page, limit, skip, sortBy, sortOrder};
};
