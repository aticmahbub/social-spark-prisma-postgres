import {Router} from 'express';
import {AuthController} from './auth.controller.js';

const router = Router();
router.post('/login', AuthController.loginUser);
router.get('/refresh-token', AuthController.refreshToken);
router.get('/me', AuthController.getMe);

export const AuthRoutes: Router = router;
