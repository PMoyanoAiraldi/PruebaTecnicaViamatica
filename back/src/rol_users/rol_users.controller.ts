import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, ValidationPipe } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RolUsersService } from "./rol_users.service";
import { CreateRolUsersDto } from "./dto/create-rolUser.dto";
import { RolUsers } from "./rol_users.entity";
import { UpdateRolUsersDto } from "./dto/update-rolUser.dto";
import { UpdateStateRolUsersDto } from "./dto/updateState-rolUser.dto";

@ApiTags("Rol User")
@Controller("rolUsers")
export class RolUsersController {
    constructor(
        private readonly rolUsersService: RolUsersService,
) { }

    @Post('register')
    @ApiOperation({ summary: 'Crear una nueva relacion de rol' })
    @ApiResponse({ status: 201, description: 'Relacion de rol creada exitosamente', type: CreateRolUsersDto })
    @ApiResponse({ status: 500, description: 'Error inesperado al crear la relacion de rol' })
    @ApiBody({
        description: 'Datos para registrar una relacion de rol',
        schema: {
            type: 'object',
            properties: {
                rolId: {type: 'number'},
                userId: { type: 'number' },
            }
        },
    })
    async createRolUsers(@Body() createRolUsers: CreateRolUsersDto) {
        const rolUser = await this.rolUsersService.createRolUsers(createRolUsers)
            return {
                message: `Relacion de rol creada exitosamente`, rolUser
            };
        }
        
    @Get()
    @ApiOperation({ summary: 'Obtener todas las relaciones de roles' })
    @ApiResponse({ status: 200, description: 'Relaciones de roles obtenidas', type: [RolUsers] })
    @HttpCode(HttpStatus.OK)
    async getRolUsers(){
        const rolUsers = await this.rolUsersService.getRolUsers()
        return rolUsers
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una relacion de rol por ID' })
    @ApiResponse({ status: 200, description: 'Relacion de rol obtenida', type: RolUsers })
    @ApiResponse({ status: 404, description: 'Relacion de rol no encontrada' })
    async getRolUsersId(@Param('id') id: number): Promise<RolUsers>{
        const rolUser = await this.rolUsersService.getRolUsersId(id)
        return rolUser
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar una relacion de rol por ID' })
    @ApiResponse({ status: 200, description: 'Relacion de rol actualizada', type: UpdateRolUsersDto })
    @ApiResponse({ status: 404, description: 'Relacion de rol no encontrada' })
    @HttpCode(HttpStatus.OK)
    @ApiBody({
        description: 'Datos para actualizar la relacion de rol',
        schema: {
            type: 'object',
            properties: {
                rolId: {type: 'number'},
                userId: { type: 'number' },
            }
        },
        })
    async updateRolUser(
    @Param('id') id: number, 
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipMissingProperties: true,transform: true})) updateRolUsersDto: UpdateRolUsersDto, 
    ): Promise<RolUsers> {
    return await this.rolUsersService.updateRolUsers(id, updateRolUsersDto);
        
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Modificar el estado de una relacion de rol para activarla o desactivarla' })
    @ApiResponse({ status: 201, description: 'Estado de la relacion de rol modificado exitosamente', type: [RolUsers] })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiResponse({ status: 500, description: 'Error inesperado al modificar el estado de la relacion de rol' })
    @ApiBody({ description: 'Cuerpo para modificar el estado de una relacion de rol', type: UpdateStateRolUsersDto })
    async updateStateRolUsers(
    @Param('id') id: number,
    @Body() updateStateRolUsersDto: UpdateStateRolUsersDto
    ): Promise<RolUsers> {
    return this.rolUsersService.patchRolUsers(id, updateStateRolUsersDto.state);
    }

}