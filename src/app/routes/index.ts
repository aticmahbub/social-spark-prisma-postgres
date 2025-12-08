import {Router} from 'express';
import {UserRoutes} from '../modules/user/user.routes.js';
import {AuthRoutes} from '../modules/auth/auth.routes.js';

export const router: Router = Router();

const moduleRoutes = [
    {path: '/user', route: UserRoutes},
    {path: '/auth', route: AuthRoutes},
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
