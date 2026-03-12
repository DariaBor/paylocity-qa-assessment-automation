import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  username: process.env.TEST_USERNAME!,
  password: process.env.TEST_PASSWORD!,
};
