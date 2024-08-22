import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { AuthGuard } from '@app/auth/auth.guard';
import { CreateClientDTO } from './dto/create.client.dto';
import { UpdateClientDTO } from './dto/update.client.dto';

@Controller('client')
@ApiTags('Client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('/')
  @ApiOperation({ summary: 'Create Client' })
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateClientDTO })
  @ApiTags('Client')
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 201, description: 'Created.' })
  @UseGuards(AuthGuard)
  async create(@Body() newContract: CreateClientDTO) {
    return await this.clientService.create(newContract);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update client' })
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UpdateClientDTO })
  @ApiTags('Client')
  @ApiResponse({ status: 200, description: 'Ok.' })
  @UseGuards(AuthGuard)
  async updateClient(@Param('id') id: number, @Body() data: UpdateClientDTO) {
    return await this.clientService.update(id, data);
  }
}
