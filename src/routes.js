import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';

import AuthMiddlleware from './app/middlewares/auth';

const upload = multer(multerConfig);
const route = new Router();
/* Rotas Usuário */
route.post('/users', UserController.store);
route.post('/session', SessionController.store);

route.use(AuthMiddlleware);

route.get('/users', UserController.index);
route.put('/users', UserController.update);

route.post('/files', upload.single('file'), FileController.store);

route.post('/meetup', MeetupController.store);

export default route;
