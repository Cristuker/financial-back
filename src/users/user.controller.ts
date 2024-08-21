import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Put,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserDTO, UpdateUserDTO } from './dto';
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

  @Put('/:id')
  @ApiOperation({ summary: 'Update a user ' })
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UpdateUserDTO })
  @ApiTags('User')
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 200, description: 'Ok.' })
  async update(@Body() user: UpdateUserDTO, @Param('id') id: number) {
    return await this.userService.update(id, user);
  }
}
