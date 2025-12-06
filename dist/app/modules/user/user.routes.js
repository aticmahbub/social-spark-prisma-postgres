import { Router } from 'express';
import { UserController } from './user.controller.js';
const router = Router();
router.post('/create-user', UserController.createUser);
export const UserRoutes = router;
//# sourceMappingURL=user.routes.js.map