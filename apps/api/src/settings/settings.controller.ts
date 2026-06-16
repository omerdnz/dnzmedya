import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '../auth/guards';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('public')
  getPublicSiteSettings() {
    return this.settingsService.getPublicSiteSettings();
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('settings.read')
  findAllGrouped() {
    return this.settingsService.findAllGrouped();
  }

  @Get(':group')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('settings.read')
  findByGroup(@Param('group') group: string) {
    return this.settingsService.findByGroup(group);
  }

  @Put(':group')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('settings.update')
  updateGroup(@Param('group') group: string, @Body() data: Record<string, unknown>) {
    return this.settingsService.updateGroup(group, data);
  }

  @Put(':group/:key')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('settings.update')
  updateByGroupKey(
    @Param('group') group: string,
    @Param('key') key: string,
    @Body('value') value: unknown,
  ) {
    return this.settingsService.updateByGroupKey(group, key, value);
  }
}
