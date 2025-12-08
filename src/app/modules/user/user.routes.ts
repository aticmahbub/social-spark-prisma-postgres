import {Router, type NextFunction, type Request, type Response} from 'express';
import {UserController} from './user.controller.js';
import {fileUploader} from '../../utils/fileUploader.js';
import {UserValidation} from './user.validation.js';

const router = Router();

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

router.get('/users', UserController.getAllUsers);

export const UserRoutes: Router = router;
