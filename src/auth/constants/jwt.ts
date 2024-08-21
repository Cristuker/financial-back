import 'dotenv/config';

export const jwtConstants = Object.freeze({
  secret: process.env.JWT_SECRET,
});
