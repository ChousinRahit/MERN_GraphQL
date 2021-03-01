import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../config.js';
import { UserInputError } from 'apollo-server';

import {
  validateRegisterInput,
  validateLoginInut,
} from '../../utils/validators.js';

const generateToken = user => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      userName: user.userName,
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
};

export default {
  Mutation: {
    async register(
      parent,
      { registerInput: { userName, email, password, confirmPassword } },
      context,
      info
    ) {
      const { valid, errors } = validateRegisterInput(
        userName,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      const user = await User.findOne({ userName });
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken',
          },
        });
      }
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        userName,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      console.log(res);

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },

    async login(_, { userName, password }, context, info) {
      const { valid, errors } = validateLoginInut(userName, password);
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      const user = await User.findOne({ userName });

      if (!user) {
        errors.general = 'User Not found';
        throw new UserInputError('Invalid Credentials', { errors });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new UserInputError('Invalid Credentials');
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
  },
};
