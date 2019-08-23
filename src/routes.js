import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import AuthMiddlleware from './app/middlewares/auth';

const route = new Router();
/* Rotas Usuário */
route.post('/users', UserController.store);
route.post('/session', SessionController.store);

route.use(AuthMiddlleware);

route.get('/users', UserController.index);
route.put('/users', UserController.update);

export default route;
