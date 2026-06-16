import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PagesModule } from './pages/pages.module';
import { PostsModule } from './posts/posts.module';
import { ServicesModule } from './services/services.module';
import { MediaModule } from './media/media.module';
import { SeoModule } from './seo/seo.module';
import { FormsModule } from './forms/forms.module';
import { CustomersModule } from './customers/customers.module';
import { QuotesModule } from './quotes/quotes.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SettingsModule } from './settings/settings.module';
import { HeroModule } from './hero/hero.module';
import { FaqsModule } from './faqs/faqs.module';
import { ScriptsModule } from './scripts/scripts.module';
import { ReferencesModule } from './references/references.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(process.cwd(), '../../.env'),
        join(process.cwd(), '.env'),
        '.env',
      ],
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PagesModule,
    PostsModule,
    ServicesModule,
    MediaModule,
    SeoModule,
    FormsModule,
    CustomersModule,
    QuotesModule,
    AnalyticsModule,
    SettingsModule,
    HeroModule,
    FaqsModule,
    ScriptsModule,
    ReferencesModule,
    DashboardModule,
    AuditModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
