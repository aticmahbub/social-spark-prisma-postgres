import {Router} from 'express';
import {EventController} from './event.controller.js';
import {checkAuth} from '../../middlewares/checkAuth.js';
import {Role} from '../../../generated/enums.js';

const router = Router();

router.get('/', EventController.getEvents);

router.post('/', checkAuth(Role.HOST, Role.USER), EventController.createEvent);

router.post('/join', checkAuth(Role.USER), EventController.joinEvent);

export const EventRoutes: Router = router;
