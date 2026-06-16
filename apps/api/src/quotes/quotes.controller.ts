import {
  Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { QuoteStatus } from '@prisma/client';
import { QuotesService } from './quotes.service';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '../auth/guards';

@Controller('quotes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class QuotesController {
  constructor(private quotesService: QuotesService) {}

  @Get()
  @Permissions('quotes.read')
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: QuoteStatus,
    @Query('customerId') customerId?: string,
  ) {
    return this.quotesService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      status,
      customerId,
    });
  }

  @Get('next-number')
  @Permissions('quotes.create')
  getNextNumber() {
    return this.quotesService.generateQuoteNumber();
  }

  @Get(':id')
  @Permissions('quotes.read')
  findOne(@Param('id') id: string) {
    return this.quotesService.findOne(id);
  }

  @Post()
  @Permissions('quotes.create')
  create(@Body() data: Record<string, unknown>) {
    return this.quotesService.create(data);
  }

  @Put(':id')
  @Permissions('quotes.update')
  update(@Param('id') id: string, @Body() data: Record<string, unknown>) {
    return this.quotesService.update(id, data);
  }

  @Patch(':id/status')
  @Permissions('quotes.update')
  updateStatus(@Param('id') id: string, @Body('status') status: QuoteStatus) {
    return this.quotesService.updateStatus(id, status);
  }

  @Delete(':id')
  @Permissions('quotes.delete')
  delete(@Param('id') id: string) {
    return this.quotesService.delete(id);
  }
}
