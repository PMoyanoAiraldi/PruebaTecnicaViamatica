import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, ValidationPipe } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RolService } from "./rol.service";
import { CreateRolDto } from "./dto/create-rol.dto";
import { Rol } from "./rol.entity";
import { UpdateRolDto } from "./dto/update-rol.dto";
import { UpdateStateRolDto } from "./dto/updateState-rol.dto";

@ApiTags("Rol ")
@Controller("rol")
export class RolController {
    constructor(
        private readonly rolService: RolService,
) { }

        @Post('register')
        @ApiOperation({ summary: 'Crear un nuevo rol' })
        @ApiResponse({ status: 201, description: 'Rol creado exitosamente', type: CreateRolDto })
        @ApiResponse({ status: 500, description: 'Error inesperado al crear el rol' })
        @ApiBody({
                description: 'Datos para registrar un rol',
                schema: {
                    type: 'object',
                    properties: {
                        rolName: { type: 'string' },
                }
                },
            })
            async createRol(@Body() createRol: CreateRolDto) {
                const rol = await this.rolService.createRol(createRol)
                return {
                    message: `Rol creado exitosamente`, rol
                };
            }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los roles' })
    @ApiResponse({ status: 200, description: 'Roles obtenidos', type: [Rol] })
    @HttpCode(HttpStatus.OK)
    async getRol(){
        const rol = await this.rolService.getRol()
        return rol
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenerun rol por ID' })
    @ApiResponse({ status: 200, description: 'Rol obtenido', type: Rol })
    @ApiResponse({ status: 404, description: 'Rol no encontrado' })
    async getRolId(@Param('id') id: number): Promise<Rol>{
        const rol = await this.rolService.getRolId(id)
        return rol
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar un rol por ID' })
    @ApiResponse({ status: 200, description: 'Rol actualizado', type: UpdateRolDto })
    @ApiResponse({ status: 404, description: 'Rol no encontrado' })
    @HttpCode(HttpStatus.OK)
    @ApiBody({
        description: 'Datos para actualizar el rol',
        type: UpdateRolDto
        })
    async updatePerson(
    @Param('id') id: number, 
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipMissingProperties: true,transform: true})) updateRolDto: UpdateRolDto, 
    ): Promise<Rol> {
    return await this.rolService.updateRol(id, updateRolDto);
        
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Modificar el estado de un rol para activarlo o desactivarlo' })
    @ApiResponse({ status: 201, description: 'Estado del rol modificado exitosamente', type: [Rol] })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiResponse({ status: 500, description: 'Error inesperado al modificar el estado del rol' })
    @ApiBody({ description: 'Cuerpo para modificar el estado de un rol', type: UpdateStateRolDto })
    async updateStateRol(
    @Param('id') id: number,
    @Body() updateStateRolDto: UpdateStateRolDto
    ): Promise<Rol> {
    return this.rolService.patchRol(id, updateStateRolDto.state);
    }
    
    
}