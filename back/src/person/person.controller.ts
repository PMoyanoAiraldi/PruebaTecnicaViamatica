import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, Req, UseGuards, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PersonService } from "./person.service";
import { CreatePersonDto } from "./dto/create-person.dto";
import { Person } from "./person.entity";
import { UpdatePersonDto } from "./dto/update-person.dto";
import { UpdateStateDto } from "./dto/updateState-person.dto";
import { AuthGuard } from "src/guard/auth.guard";
import { RolesGuard } from "src/guard/roles.guard";
import { Roles } from "src/decorators/roles.decorators";
import { SearchPersonDto } from "./dto/search-person.dto";

@ApiTags("Person ")
@Controller("person")
export class PersonController {
    constructor(
        private readonly personService: PersonService,
) { }

    @Post('register')
    @ApiOperation({ summary: 'Crear una nueva persona' })
    @ApiResponse({ status: 201, description: 'Persona creada exitosamente', type: CreatePersonDto })
    @ApiResponse({ status: 500, description: 'Error inesperado al crear la persona' })
    @ApiBody({
            description: 'Datos para registrar la persona',
            schema: {
                type: 'object',
                properties: {
                    names: { type: 'string' },
                    surnames: { type: 'string' },
                    identification: { type: 'string' },
                    dateBirth: {
                        type: 'string',
                        format: 'date',
                        example: '1997-03-24',
                },
            }
            },
        })
        async createPerson(@Body() createPerson: CreatePersonDto) {
            const person = await this.personService.createPerson(createPerson)
            return {
                message: `Persona creada exitosamente`, person
            };
        }


    @Get('search')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('Administrador')
    @ApiBearerAuth()
    searchPeople(@Query() filters: SearchPersonDto) {
    return this.personService.searchPersonsAdmin(filters);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las personas' })
    @ApiResponse({ status: 200, description: 'Personas obtenidas', type: [Person] })
    @HttpCode(HttpStatus.OK)
    async getPersons(){
        const persons = await this.personService.getPersons()
        return persons
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener persona por ID' })
    @ApiResponse({ status: 200, description: 'Persona obtenida', type: Person })
    @ApiResponse({ status: 404, description: 'Persona no encontrada' })
    async getPerson(@Param('id') id: number): Promise<Person>{
        const person = await this.personService.getPerson(id)
        return person
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar una persona por ID' })
    @ApiResponse({ status: 200, description: 'Persona actualizada', type: UpdatePersonDto })
    @ApiResponse({ status: 404, description: 'Persona no encontrada' })
    @HttpCode(HttpStatus.OK)
    @ApiBody({
        description: 'Datos opcionales para actualizar la persona',
        type: UpdatePersonDto
    })
    async updatePerson(
        @Param('id') id: number, 
        @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipMissingProperties: true,transform: true})) updatePersonDto: UpdatePersonDto, 
        ): Promise<Person> {
            return await this.personService.updatePerson(id, updatePersonDto);
    
    }

    

    @Put('admin/:id')
    @UseGuards(AuthGuard, RolesGuard) 
    @Roles('Administrador') 
    @ApiBearerAuth() 
    async updatePersonByAdmin(@Param('id') id: number, @Req() req,
    @Body(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    skipMissingProperties: true,
    transform: true
    })) updatePersonDto: UpdatePersonDto
    ): Promise<Person> {
    return await this.personService.updatePersonByAdmin(id, updatePersonDto);
}

    @Patch(':id')
    @ApiOperation({ summary: 'Modificar el estado de una persona para activarla o desactivarla' })
    @ApiResponse({ status: 201, description: 'Estado de la persona modificado exitosamente', type: [Person] })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiResponse({ status: 500, description: 'Error inesperado al modificar el estado de la persona' })
    @ApiBody({ description: 'Cuerpo para modificar el estado de una persona', type: UpdateStateDto })
    async updateStatePerson(
    @Param('id') id: number,
    @Body() updateStateDto: UpdateStateDto
    ): Promise<Person> {
    return this.personService.patchPerson(id, updateStateDto.state);
    }


}