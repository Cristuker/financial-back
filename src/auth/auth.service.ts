import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenDTO } from './dto/token.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(
    email: string,
    password: string,
    hashedPassword: string,
    id: number,
  ): Promise<TokenDTO> {
    if (!this.comparePassword(password, hashedPassword)) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const payload = { id: id, username: email };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
    };
  }

  async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
