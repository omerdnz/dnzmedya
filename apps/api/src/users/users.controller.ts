import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '../auth/guards';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('roles')
  @Permissions('users.read')
  findAllRoles() {
    return this.usersService.findAllRoles();
  }

  @Get('roles/:roleId')
  @Permissions('users.read')
  findRole(@Param('roleId') roleId: string) {
    return this.usersService.findRole(roleId);
  }

  @Get()
  @Permissions('users.read')
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('roleId') roleId?: string,
  ) {
    return this.usersService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      search,
      roleId,
    });
  }

  @Get(':id')
  @Permissions('users.read')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Permissions('users.create')
  create(@Body() data: Record<string, unknown>) {
    return this.usersService.create(data);
  }

  @Put(':id')
  @Permissions('users.update')
  update(@Param('id') id: string, @Body() data: Record<string, unknown>) {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  @Permissions('users.delete')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
