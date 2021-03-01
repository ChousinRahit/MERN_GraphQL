import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config.js';
import { AuthenticationError } from 'apollo-server';
export default context => {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    console.log(authHeader, 'AUTH HEADer');
    const token = authHeader.split('Bearer ')[1];
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        return user;
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired Token');
      }
    }
    throw new Error('Authentication token must be "Bearer [token]" ');
  }
  throw new Error('Autheization header must be provided');
};
