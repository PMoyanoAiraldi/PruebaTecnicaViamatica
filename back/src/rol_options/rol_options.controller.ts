import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, ValidationPipe } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RolOptionsService } from "./rol_options.service";
import { CreateRolOptionsDto } from "./dto/create-rolOptions.dto";
import { RolOptions } from "./rol_options.entity";
import { UpdateRolOptionsDto } from "./dto/update-rolOptions.dto";
import { UpdateStateRolOptionDto } from "./dto/updateState-rolOptions.dto";

@ApiTags("Rol Options")
@Controller("rolOptions")
export class RolOptionsController {
    constructor(
        private readonly rolOptionsService: RolOptionsService,
) { }

    @Post('register')
    @ApiOperation({ summary: 'Crear una nueva opcion de rol' })
    @ApiResponse({ status: 201, description: 'Opcion de rol creada exitosamente', type: CreateRolOptionsDto })
    @ApiResponse({ status: 500, description: 'Error inesperado al crear la opcion de rol' })
    @ApiBody({
        description: 'Datos para registrar una opcion de rol',
        schema: {
            type: 'object',
            properties: {
                rolId: {type: 'number'},
                nameOption: { type: 'string' },
            }
        },
    })
    async createRolOption(@Body() createRolOption: CreateRolOptionsDto) {
        const rolOption = await this.rolOptionsService.createRolOptions(createRolOption)
            return {
                message: `Opcion de rol creada exitosamente`, rolOption
            };
        }
    @Get()
    @ApiOperation({ summary: 'Obtener todas las opciones de roles' })
    @ApiResponse({ status: 200, description: 'Opcion de roles obtenidas', type: [RolOptions] })
    @HttpCode(HttpStatus.OK)
    async getRolOption(){
        const rolOption = await this.rolOptionsService.getRolOption()
        return rolOption
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una opcion de rol por ID' })
    @ApiResponse({ status: 200, description: 'Opcion de rol obtenida', type: RolOptions })
    @ApiResponse({ status: 404, description: 'Opcion de rol no encontrada' })
    async getRolOptionId(@Param('id') id: number): Promise<RolOptions>{
        const rolOption = await this.rolOptionsService.getRolOptionId(id)
        return rolOption
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar una opcion de rol por ID' })
    @ApiResponse({ status: 200, description: 'Opcion de rol actualizada', type: UpdateRolOptionsDto })
    @ApiResponse({ status: 404, description: 'Opcion de rol no encontrada' })
    @HttpCode(HttpStatus.OK)
    @ApiBody({
        description: 'Datos para actualizar la opcion de rol',
        schema: {
            type: 'object',
            properties: {
                rolId: {type: 'number'},
                nameOption: { type: 'string' },
            }
        },
        })
    async updateRolOption(
    @Param('id') id: number, 
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipMissingProperties: true,transform: true})) updateRolOptionDto: UpdateRolOptionsDto, 
    ): Promise<RolOptions> {
    return await this.rolOptionsService.updateRolOption(id, updateRolOptionDto);
        
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Modificar el estado de una opcion de rol para activarla o desactivarla' })
    @ApiResponse({ status: 201, description: 'Estado de la opcion de rol modificado exitosamente', type: [RolOptions] })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiResponse({ status: 500, description: 'Error inesperado al modificar el estado de la opcion de rol' })
    @ApiBody({ description: 'Cuerpo para modificar el estado de la opcion de un rol', type: UpdateStateRolOptionDto })
    async updateStateRolOption(
    @Param('id') id: number,
    @Body() updateStateRolOptionDto: UpdateStateRolOptionDto
    ): Promise<RolOptions> {
    return this.rolOptionsService.patchRolOption(id, updateStateRolOptionDto.state);
    }
        

}