import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '../auth/guards';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  @Permissions('dashboard.read')
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('overview')
  @Permissions('dashboard.read')
  getOverview() {
    return this.dashboardService.getOverview();
  }
}
