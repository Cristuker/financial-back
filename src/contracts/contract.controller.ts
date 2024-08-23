import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Query,
  Patch,
  Param,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ContractService } from './contract.service';
import { CreateContractDTO } from './dto/create.contract.dto';
import { AuthGuard } from '@app/auth/auth.guard';
import { ListContractDTO } from './dto/list.contract.dto';
import { UpdateContractDTO } from './dto/update.contract.dto';

@Controller('contract')
@ApiTags('Contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post('/')
  @ApiOperation({ summary: 'Create contract' })
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateContractDTO })
  @ApiTags('Contract')
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 201, description: 'Created.' })
  @UseGuards(AuthGuard)
  async create(@Body() newContract: CreateContractDTO) {
    return await this.contractService.create(newContract);
  }

  @Get('/')
  @ApiOperation({ summary: 'Create contract' })
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: ListContractDTO })
  @ApiTags('Contract')
  @ApiResponse({ status: 200, description: 'Ok.' })
  @UseGuards(AuthGuard)
  async list(
    @Query('date') date: string,
    @Query('clientId') clientId: number,
    @Query('contractNumber') contractNumber: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const result = await this.contractService.listFiltered(
      date,
      clientId,
      contractNumber,
      page,
      limit,
    );
    return {
      contracts: result,
    };
  }

  @Patch('/:id/cancel')
  @ApiOperation({ summary: 'Cancel contract' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiTags('Contract')
  @ApiResponse({ status: 204, description: 'No content.' })
  @UseGuards(AuthGuard)
  async cancel(@Param('id') id: number) {
    await this.contractService.cancel(id);
  }

  @Patch('/:id/remove')
  @ApiOperation({ summary: 'Remove client from contract' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiTags('Contract')
  @ApiResponse({ status: 204, description: 'No content.' })
  @UseGuards(AuthGuard)
  async removeClient(@Param('id') id: number) {
    await this.contractService.removeClient(id);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Remove client from contract' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({ type: UpdateContractDTO })
  @ApiTags('Contract')
  @ApiResponse({ status: 204, description: 'No content.' })
  @UseGuards(AuthGuard)
  async updateContract(
    @Param('id') id: number,
    @Body() data: UpdateContractDTO,
  ) {
    await this.contractService.update(id, data);
  }

  @Patch('/:id/pay')
  @ApiOperation({ summary: 'Pay a contract' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiTags('Contract')
  @ApiResponse({ status: 204, description: 'No content.' })
  @UseGuards(AuthGuard)
  async pay(@Param('id') id: number) {
    await this.contractService.pay(id);
  }
}
