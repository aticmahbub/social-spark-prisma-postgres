import {Router} from 'express';
import {EventController} from './event.controller.js';
import {checkAuth} from '../../middlewares/checkAuth.js';
import {Role} from '../../../generated/enums.js';

const router = Router();

router.get('/', EventController.getEvents);

router.post('/', checkAuth(Role.HOST, Role.USER), EventController.createEvent);
router.get('/:id', EventController.getEventById);

router.post('/join', checkAuth(Role.USER), EventController.joinEvent);

router.get(
    '/my-events',
    checkAuth(Role.HOST, Role.USER),
    EventController.getMyHostedEvents,
);

router.patch(
    '/my-events/:eventId',
    checkAuth(Role.HOST),
    EventController.updateMyEvent,
);

export const EventRoutes: Router = router;
