import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import SessionController from './app/controllers/SessionController';
import AuthMiddlleware from './app/middlewares/auth';
import MeetupController from './app/controllers/MeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';

const route = new Router();
const upload = multer(multerConfig);
/* Rotas Usuário */
route.post('/users', UserController.store);
route.post('/session', SessionController.store);

route.use(AuthMiddlleware);

// route.get('/users', UserController.index);
route.put('/users', UserController.update);

route.post('/files', upload.single('file'), FileController.store);

route.get('/meetup', MeetupController.show);
route.post('/meetup', MeetupController.store);
route.put('/meetup/:id', MeetupController.update);
route.delete('/meetup/:id', MeetupController.delete);

route.post('/subscription', SubscriptionController.store);
route.get('/subscription', SubscriptionController.show);
export default route;
