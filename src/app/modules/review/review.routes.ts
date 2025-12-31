import {Router} from 'express';
import {checkAuth} from '../../middlewares/checkAuth.js';
import {Role} from '../../../generated/enums.js';
import {ReviewController} from './review.controller.js';

const router = Router();

router.post('/', checkAuth(Role.USER), ReviewController.createReview);

export const ReviewRoutes: Router = router;
