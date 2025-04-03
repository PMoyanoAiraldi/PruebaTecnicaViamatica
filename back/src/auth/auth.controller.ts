import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "src/users/dto/login-user.dto";
import { AuthGuard } from "src/guard/auth.guard";
import { Request } from 'express';


export interface AuthenticatedRequest extends Request {
    user?: { id: number };
}

@ApiTags("Auth ")
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'Loguear un usuario' })
    @ApiResponse({ status: 201, description: 'Usuario logueado exitosamente', type: LoginUserDto })
    @ApiResponse({ status: 500, description: 'Error inesperado al loguear el usuario' })
    @ApiBody({
            description: 'Datos para iniciar sesion',
            schema: {
                type: 'object',
                properties: {
                    identifier: { type: 'string' },
                    password: { type: 'string' },
                },
            },
})
    async login(@Body() loginDto: LoginUserDto) {
        return this.authService.login(loginDto);
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Req() req: AuthenticatedRequest) {
        if (!req.user || typeof req.user.id !== 'number') {
            throw new Error('Invalid or missing user ID');
        }
        return this.authService.logout(req.user.id);
}
}
