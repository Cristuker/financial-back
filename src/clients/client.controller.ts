import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { AuthGuard } from '@app/auth/auth.guard';
import { CreateClientDTO } from './dto/create.client.dto';

@Controller('client')
@ApiTags('Client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('/')
  @ApiOperation({ summary: 'Create Client' })
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateClientDTO })
  @ApiTags('client')
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 201, description: 'Created.' })
  @UseGuards(AuthGuard)
  async create(@Body() newContract: CreateClientDTO) {
    return await this.clientService.create(newContract);
  }
}
