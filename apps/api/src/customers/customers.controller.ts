import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { CustomerStatus } from '@prisma/client';
import { CustomersService } from './customers.service';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '../auth/guards';

@Controller('customers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get()
  @Permissions('crm.read')
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: CustomerStatus,
    @Query('search') search?: string,
  ) {
    return this.customersService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      status,
      search,
    });
  }

  @Get(':id/activities')
  @Permissions('crm.read')
  findActivities(@Param('id') id: string) {
    return this.customersService.findActivities(id);
  }

  @Get(':id')
  @Permissions('crm.read')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Post(':id/activities')
  @Permissions('crm.create')
  createActivity(@Param('id') id: string, @Body() data: Record<string, unknown>) {
    return this.customersService.createActivity(id, data);
  }

  @Post()
  @Permissions('crm.create')
  create(@Body() data: Record<string, unknown>) {
    return this.customersService.create(data);
  }

  @Put(':id/activities/:activityId')
  @Permissions('crm.update')
  updateActivity(
    @Param('id') id: string,
    @Param('activityId') activityId: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.customersService.updateActivity(id, activityId, data);
  }

  @Put(':id')
  @Permissions('crm.update')
  update(@Param('id') id: string, @Body() data: Record<string, unknown>) {
    return this.customersService.update(id, data);
  }

  @Delete(':id/activities/:activityId')
  @Permissions('crm.delete')
  deleteActivity(@Param('id') id: string, @Param('activityId') activityId: string) {
    return this.customersService.deleteActivity(id, activityId);
  }

  @Delete(':id')
  @Permissions('crm.delete')
  delete(@Param('id') id: string) {
    return this.customersService.delete(id);
  }
}
