import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { UserService } from './user.service.js';
const createUser = catchAsync(async (req, res) => {
    const user = await UserService.createUser();
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: 'User Created Successfully',
        data: user,
    });
});
export const UserController = { createUser };
//# sourceMappingURL=user.controller.js.map