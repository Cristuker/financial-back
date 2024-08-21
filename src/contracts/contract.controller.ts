import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ContractService } from './contract.service';
import { CreateContractDTO } from './dto/create.contract.dto';
import { AuthGuard } from '@app/auth/auth.guard';

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
}
