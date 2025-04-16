import { Body, Controller, Post, Put, Req, UseGuards } from "@nestjs/common";
import {  ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "src/users/dto/login-user.dto";
import { AuthGuard } from "src/guard/auth.guard";
import { Request } from 'express';
import { ResetPasswordDto } from "./dto/reset-password.dto";


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
        const user = await this.authService.login(loginDto);
    
        // Aquí asumes que el `authService.login` devuelve el usuario completo, o puedes agregarlo si es necesario.
        return {
            access_token: user.access_token,
            id: user.id,
            role: user.role,  
            email: user.email,  // Puedes agregar más detalles si es necesario
        };
    }

    @Post('logout')
    @UseGuards(AuthGuard)
    @ApiSecurity('bearer')
    async logout(@Req() req: AuthenticatedRequest) {
        const userId = req.user?.id;
        if (typeof userId !== 'number') {
            throw new Error('Invalid or missing user ID');
        }

        return this.authService.logout(userId);
}
    @Put('reset-password')
    async resetPassword(@Body() resetDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetDto);
    }

}
