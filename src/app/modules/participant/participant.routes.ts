import {checkAuth} from '../../middlewares/checkAuth.js';
import {Role} from '../../../generated/browser.js';
import {ParticipantController} from './participant.controller.js';
import {Router} from 'express';

const router = Router();

router.get(
    '/my-events/:eventId',
    checkAuth(Role.HOST),
    ParticipantController.getEventParticipants,
);

export const ParticipantRoutes: Router = router;
