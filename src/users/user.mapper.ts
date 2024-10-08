import { UserDTO } from './dto/user.dto';
import { User } from '@prisma/client';

export const userMapper = (user: User): UserDTO => {
  if (!user) return null;
  return {
    email: user?.email,
    id: user?.id,
    name: user?.name,
    password: user?.password,
  };
};
