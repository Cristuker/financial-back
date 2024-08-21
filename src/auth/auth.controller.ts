import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenDTO } from './dto/token.dto';
import { UserService } from '@app/users/user.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: AuthDTO })
  @ApiResponse({ status: 200, type: TokenDTO })
  @ApiResponse({ status: 400, description: 'User not found' })
  async login(@Body() body: AuthDTO) {
    const user = await this.userService.findOneByEmail(body.email);
    if (!user) {
      this.logger.error('User not found');
      throw new BadRequestException('User not found');
    }
    const access_token = await this.authService.signIn(
      body.email,
      body.password,
      user.password,
      user.id,
    );
    this.logger.log('User authenticated');
    return access_token;
  }
}
