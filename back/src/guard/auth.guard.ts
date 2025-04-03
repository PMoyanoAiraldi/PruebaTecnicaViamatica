import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';



interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    const request: Request = context.switchToHttp().getRequest() 
    const token = this.extractTokenFromHeader(request)

    if(!token){
      throw new UnauthorizedException('El token no fue encontrado')
    }

    try{
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET') 
      });
      
      request['user'] = {
        ...payload,
        iatDate: new Date(payload.iat * 1000),
        expDate: new Date(payload.exp * 1000),
      };

      console.log('Payload', request['user']);
    }catch{
      throw new UnauthorizedException('Token invalido')
    }
    return true
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined
  }
}