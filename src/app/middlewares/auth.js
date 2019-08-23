import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/authConfig';

export default async (req, res, next) => {
  const token = req.headers.authorization;

  const [, header] = token.split(' ');
  try {
    const payload = await promisify(jwt.verify)(header, authConfig.secret);
    req.userId = payload.id;
    req.next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid Token!' });
  }
};
