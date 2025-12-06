import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.routes.js';
export const router = Router();
const moduleRoutes = [{ path: '/user', route: UserRoutes }];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
//# sourceMappingURL=index.js.map