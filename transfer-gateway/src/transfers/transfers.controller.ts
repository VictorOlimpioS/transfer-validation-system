import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransfersService } from './transfers.service';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @HttpCode(202)
  @Post()
  createTransfer(@Body() createTransferDto: CreateTransferDto) {
    return this.transfersService.create(createTransferDto);
  }
}
