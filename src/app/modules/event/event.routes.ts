import {Router, type NextFunction, type Request, type Response} from 'express';
import {EventController} from './event.controller.js';
import {checkAuth} from '../../middlewares/checkAuth.js';
import {Role} from '../../../generated/enums.js';
import {fileUploader} from '../../utils/fileUploader.js';
import {createEventSchema} from './event.validation.js';

const router = Router();

router.get('/', EventController.getEvents);

router.post(
    '/',
    checkAuth(Role.HOST, Role.USER),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = createEventSchema.parse(JSON.parse(req.body.data));
        return EventController.createEvent(req, res, next);
    },
);

router.post('/join', checkAuth(Role.USER), EventController.joinEvent);

router.get(
    '/my-events',
    checkAuth(Role.HOST, Role.USER),
    EventController.getMyHostedEvents,
);

// ADD FILE UPLOAD MIDDLEWARE HERE
router.patch(
    '/my-events/:eventId',
    checkAuth(Role.HOST),
    fileUploader.upload.single('file'), // Added this line
    (req: Request, res: Response, next: NextFunction) => {
        // Parse data field if it exists
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        return EventController.updateMyEvent(req, res, next);
    },
);

router.get('/:id', EventController.getEventById);

router.delete('/:id', checkAuth(Role.HOST), EventController.deleteHostedEvent);

export const EventRoutes: Router = router;
