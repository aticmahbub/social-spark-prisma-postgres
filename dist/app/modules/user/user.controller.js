import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { UserService } from './user.service.js';
import pick from '../../utils/pick.js';
import { userFilterableFields } from './user.constants.js';
const createUser = catchAsync(async (req, res) => {
    const user = await UserService.createUser(req);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: 'User is Created Successfully',
        data: user,
    });
});
const getProfile = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await UserService.getProfile(user);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Profile fetched successfully',
        data: result,
    });
});
const updateProfile = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await UserService.updateProfile(req, user);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Profile updated successfully',
        data: result,
    });
});
const getAllUsers = catchAsync(async (req, res) => {
    const filters = pick(req.query, userFilterableFields);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await UserService.getAllUsers(filters, options);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User data is retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});
// For hosts with ratings
const getHostProfileWithRating = catchAsync(async (req, res) => {
    const user = req.user;
    const id = req.params.hostId;
    const result = await UserService.getHostProfileWithRating(user, id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Profile fetched successfully',
        data: result,
    });
});
const getPublicHostProfileWithEvents = catchAsync(async (req, res) => {
    const id = req.params.hostId;
    const result = await UserService.getPublicHostProfileWithEvents(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Profile fetched successfully',
        data: result,
    });
});
export const UserController = {
    createUser,
    getAllUsers,
    getProfile,
    updateProfile,
    getHostProfileWithRating,
    getPublicHostProfileWithEvents,
};
//# sourceMappingURL=user.controller.js.map