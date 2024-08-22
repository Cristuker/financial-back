import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ContractService } from './contract.service';
import { CreateContractDTO } from './dto/create.contract.dto';
import { AuthGuard } from '@app/auth/auth.guard';
import { ListContractDTO } from './dto/list.contract.dto';

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
}
