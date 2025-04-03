import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

interface JwtPayload {
  sub: number; 
  iat?: number; 
  exp?: number; 
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private readonly usersService: UsersService, 
  ) {

    const jwtSecret = configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET no está definido en las variables de entorno.');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() as (req: Request) => string | null, 
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    
    const { sub: userId } = payload;

    const user = await this.usersService.getUserForId(userId); 

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }
}

