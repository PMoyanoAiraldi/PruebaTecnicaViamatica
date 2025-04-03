import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";

@ApiTags("Users")
@Controller("usuarios")
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
) { }

    @Post('register')
    @ApiOperation({ summary: 'Crear un nuevo usuario' })
    @ApiResponse({ status: 201, description: 'Usuario creado exitosamente', type: CreateUserDto })
    @ApiResponse({ status: 500, description: 'Error inesperado al crear el usuario' })
    @ApiBody({
        description: 'Datos para registrar el usuario',
        schema: {
            type: 'object',
            properties: {
                username: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
                status: { type: 'string' },
            },
        },
    })
    async crearUsuario(@Body() createUser: CreateUserDto) {
        createUser.username = createUser.username.trim();  // ✨ Elimina espacios
    console.log(`"${createUser.username}"`, createUser.username.length); // 🔍 Verifica la longitud
        const user = await this.usersService.createUser(createUser)
        return {
            message: `Usuario creado exitosamente`, user
        };
    }
}