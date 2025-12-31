import {Router} from 'express';
import {UserRoutes} from '../modules/user/user.routes.js';
import {AuthRoutes} from '../modules/auth/auth.routes.js';
import {EventRoutes} from '../modules/event/event.routes.js';
import {ParticipantRoutes} from '../modules/participant/participant.routes.js';

export const router: Router = Router();

const moduleRoutes = [
    {path: '/user', route: UserRoutes},
    {path: '/auth', route: AuthRoutes},
    {path: '/event', route: EventRoutes},
    {path: '/participant', route: ParticipantRoutes},
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
