import {Router, type NextFunction, type Request, type Response} from 'express';
import {UserController} from './user.controller.js';
import {fileUploader} from '../../utils/fileUploader.js';
import {UserValidation} from './user.validation.js';
import {checkAuth} from '../../middlewares/checkAuth.js';
import {Role} from '../../../generated/enums.js';

const router = Router();

router.get('/users', checkAuth(Role.ADMIN), UserController.getAllUsers);

router.post(
    '/create-user',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createUserValidationSchema.parse(
            JSON.parse(req.body.data),
        );
        return UserController.createUser(req, res, next);
    },
);

export const UserRoutes: Router = router;
