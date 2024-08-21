import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDTO } from './dto/create.user.dto';
import { UserDTO } from './dto/user.dto';
import { userMapper } from './user.mapper';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly saltOrRounds = 10;

  constructor(private readonly userRepository: UserRepository) {}

  async create(user: CreateUserDTO): Promise<UserDTO> {
    const alreadyExistUser = await this.userRepository.findOneByEmail(
      user.email,
    );
    if (alreadyExistUser) {
      throw new ConflictException('E-mail already exists.');
    }
    const encryptedPassword = await this.encryptPassword(user.password);
    user.password = encryptedPassword;
    const createdUser = await this.userRepository.create(user);
    return userMapper(createdUser);
  }

  async findById(id: number): Promise<UserDTO> {
    const user = await this.userRepository.findOneById(id);
    return userMapper(user);
  }

  private async encryptPassword(password: string) {
    return await bcrypt.hash(password, this.saltOrRounds);
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneByEmail(email);
    return userMapper(user);
  }
}
