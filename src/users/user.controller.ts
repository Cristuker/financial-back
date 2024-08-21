import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserDTO } from './dto/create.user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  @ApiOperation({ summary: 'Create user' })
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateUserDTO })
  @ApiTags('User')
  @ApiResponse({ status: 409, description: 'Conflict.' })
  @ApiResponse({ status: 201, description: 'Created.' })
  async create(@Body() createUserDto: CreateUserDTO) {
    return await this.userService.create(createUserDto);
  }
}
