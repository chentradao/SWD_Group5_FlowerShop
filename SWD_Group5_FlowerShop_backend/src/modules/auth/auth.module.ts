import { Module, Provider } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './google.strategy';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    MailModule
    // UserModule, // Make sure this is here
  ],
  providers: (() => {
  const baseProviders: Provider[] = [AuthService, JwtStrategy, JwtAuthGuard];
    // Only add GoogleStrategy if Google OAuth env vars are present
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      baseProviders.push(GoogleStrategy);
    }
    return baseProviders;
  })(),
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
