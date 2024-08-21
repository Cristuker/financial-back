import { UserDTO } from './dto/user.dto';
import { User } from '@prisma/client';

export const userMapper = (user: User): UserDTO => {
  return {
    contracts: [],
    cpfCnpj: user.cpfCnpj,
    email: user.email,
    id: user.id,
    name: user.name,
    password: user.password,
    phoneNumber: user.phoneNumber,
  };
};
