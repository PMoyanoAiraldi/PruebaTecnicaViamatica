import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable } from "rxjs";

interface UserPayload {
    id: string;
    email: string;
    rol: string;
}
// 🔹 Extender la interfaz Request para incluir `user`
interface AuthenticatedRequest extends Request {
    user?: UserPayload;
}

@Injectable()
export class RolesGuard implements CanActivate{
    constructor (private readonly reflector : Reflector){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(), 
            context.getClass()]);
            
    if (!requiredRoles) {
        return true;
    }

    // Usar `AuthenticatedRequest` en lugar de `Request`
    const request: AuthenticatedRequest = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
        throw new ForbiddenException('Usuario no autenticado');
    }

    if (!requiredRoles.includes(user.rol)) {
        throw new ForbiddenException('No tienes los permisos necesarios');
    }

    return true;
    
    }
}