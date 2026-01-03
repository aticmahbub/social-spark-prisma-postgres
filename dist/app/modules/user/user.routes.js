import { Router } from 'express';
import { UserController } from './user.controller.js';
import { fileUploader, upload } from '../../utils/fileUploader.js';
import { UserValidation } from './user.validation.js';
import { checkAuth } from '../../middlewares/checkAuth.js';
import { Role } from '../../../generated/enums.js';
const router = Router();
router.get('/users', checkAuth(Role.ADMIN), UserController.getAllUsers);
router.get('/event/:hostId', UserController.getPublicHostProfileWithEvents);
router.get('/review/:hostId', checkAuth(Role.ADMIN), UserController.getHostProfileWithRating);
router.get('/profile', checkAuth(Role.USER, Role.HOST, Role.ADMIN), UserController.getProfile);
router.patch('/update-profile', checkAuth(Role.USER, Role.HOST, Role.ADMIN), upload.single('file'), UserController.updateProfile);
router.post('/create-user', fileUploader.upload.single('file'), (req, res, next) => {
    req.body = UserValidation.createUserValidationSchema.parse(JSON.parse(req.body.data));
    return UserController.createUser(req, res, next);
});
export const UserRoutes = router;
//# sourceMappingURL=user.routes.js.map