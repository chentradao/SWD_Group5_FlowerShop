import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// Support extracting JWT from Authorization header OR cookie named 'token'
const cookieExtractor = function (req: any) {
  let token = null;
  try {
    if (req && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
  } catch (e) {
    // ignore
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor,
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    // Return both id and userId for compatibility with existing code that checks user.id || user.userId || user.sub
    return { id: payload.sub, userId: payload.sub, email: payload.email, role: payload.role };
  }
}
