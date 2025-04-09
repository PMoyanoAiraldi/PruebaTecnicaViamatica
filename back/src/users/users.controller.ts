import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, ValidationPipe } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./users.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateStatusUserDto } from "./dto/updateState-user.dto";

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
                status: { type: 'string', default: 'activo' },
                personId: {type: 'number'}
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

    @Get(':id')
    @ApiOperation({ summary: 'Obtener usuario por ID' })
    @ApiResponse({ status: 200, description: 'Usuario obtenido', type: User })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    async getUser(@Param('id') id: number): Promise<User>{
        const user = await this.usersService.getUserForId(id)
        return user
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los usuarios' })
    @ApiResponse({ status: 200, description: 'Usuarios obtenidos', type: [User] })
    @HttpCode(HttpStatus.OK)
    async getUsers(){
        const users = await this.usersService.getUsers()
        return users
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar un usuario por ID' })
    @ApiResponse({ status: 200, description: 'Usuario actualizado', type: UpdateUserDto})
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    @HttpCode(HttpStatus.OK)
    @ApiBody({
        description: 'Datos opcionales para actualizar el usuario',
        schema: {
            type: 'object',
            properties: {
                username: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
                status: { type: 'string', default: 'activo' },
                
            },
        },
    })
    async updateUser(
    @Param('id') id: number, 
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipMissingProperties: true,transform: true})) updateUserDto: UpdateUserDto, 
    ): Promise<User> {
        return await this.usersService.updateUsers(id, updateUserDto);
        
    }
    
    @Patch(':id')
    @ApiOperation({ summary: 'Modificar el estado de un usuario para activarlo o desactivarlo' })
    @ApiResponse({ status: 201, description: 'Estado del usuario modificado exitosamente', type: [User] })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiResponse({ status: 500, description: 'Error inesperado al modificar el estado del usuario' })
    @ApiBody({ description: 'Cuerpo para modificar el estado de un usuario', type: UpdateStatusUserDto })
    async updateStatusUser(
    @Param('id') id: number,
    @Body() updateStatusDto: UpdateStatusUserDto
    ): Promise<User> {
    return this.usersService.patchUser(id, updateStatusDto.status);
    }


}