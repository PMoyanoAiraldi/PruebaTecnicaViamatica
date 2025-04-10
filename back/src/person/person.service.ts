import { BadRequestException, ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Person } from "./person.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryFailedError, Repository } from "typeorm";
import { CreatePersonDto } from "./dto/create-person.dto";
import { UpdatePersonDto } from "./dto/update-person.dto";

@Injectable()
export class PersonService {
    constructor(
        @InjectRepository(Person)
        private readonly personRepository: Repository<Person>,
            
    ) { }

    async createPerson(createPersonDto: CreatePersonDto): Promise <Person>{
        try{
        const { names, surnames, identification, dateBirth } = createPersonDto;   
        
        const normalizedName = names.trim().toLowerCase();
        const normalizedSurnames = surnames.trim().toLowerCase();
    
        const existingNames = await this.personRepository
        .createQueryBuilder('person')
        .where('LOWER(person.names) = :names', { names: normalizedName })
        .andWhere('LOWER(person.surnames) = :surnames', { surnames: normalizedSurnames })
        .getOne();
    
        if (existingNames) {
            throw new HttpException(`La persona "${names} ${surnames}" ya está registrada.`, HttpStatus.BAD_REQUEST);
        }
        if (!/^\d{10}$/.test(identification) || /(\d)\1{3}/.test(identification)) {
            throw new HttpException(
                'La identificación debe tener 10 dígitos, no puede repetir 4 números seguidos y no debe contener letras.',
                HttpStatus.BAD_REQUEST,
            );
        }
    
        const person = this.personRepository.create({
        names: names.trim(), 
        surnames: surnames.trim(),
        identification,
        dateBirth        
    });

    console.log("Persona antes de ser guardada", person)
    return await this.personRepository.save(person);

} catch (error) {
    if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
        // Error de unicidad detectado (código específico de PostgreSQL)
        throw new HttpException(
            'Ya existe una persona con ese nombre.',
            HttpStatus.BAD_REQUEST,
        );
    }
    // Si el error no es de unicidad, lánzalo tal como está
    throw error;
    }
}

async getPersons(): Promise<Person[]>{
    const persons =  await this.personRepository.find()
    return persons
}

async getPerson(idPerson: number): Promise<Person>{
    const person = await this.personRepository.findOne({where:{idPerson}  })

    if (!person) {
        throw new NotFoundException(`Persona con ID ${idPerson} no encontrada`);
    }

    return person
}

async updatePerson(idPerson: number,updatePersonDto: UpdatePersonDto): Promise<Person>{
    const person = await this.personRepository.findOne({ where: { idPerson } });
    if (!person) {
        throw new Error(`Persona con ${idPerson} no fue encontrada`);
    }

    if (
        updatePersonDto.identification &&
        updatePersonDto.identification !== person.identification
    ) {
        if (!/^\d{10}$/.test(updatePersonDto.identification)) {
            throw new BadRequestException('La identificación debe tener exactamente 10 dígitos.');
        }
    }
    const updateData = {
        names: updatePersonDto.names || person.names,  
        surnames: updatePersonDto.surnames || person.surnames,        
        identification: updatePersonDto.identification || person.identification,  
        dateBirth: updatePersonDto.dateBirth || person.dateBirth
    };
        
            // Guardar los cambios en la base de datos
            await this.personRepository.save({ ...person, ...updateData });

            return { ...person, ...updateData };
}

async updatePersonByAdmin(idPerson: number, dto: UpdatePersonDto): Promise<Person> {
    const person = await this.personRepository.findOne({
        where: { idPerson },
        relations: ['users', 'users.rolesUsers', 'users.rolesUsers.rol'],
    });

    if (!person) throw new NotFoundException('Persona no encontrada');

    const user = person.users?.[0]; //ya que una persona pued etenr varios usuarios se accede al primer usuario asociado
    if (!user) throw new NotFoundException('No se encontró un usuario asociado');

    const esAdmin = user.rolesUsers?.some(ru => ru.rol.rolName === 'Administrador');
    if (esAdmin) throw new ForbiddenException('No puedes modificar a otro administrador');

    const updated = { ...person, ...dto };

    try {
    return await this.personRepository.save(updated);
    } catch (error) {
    if (error.code === '23505') {
        throw new ConflictException('Ya existe una persona con esa identificación');
    }
    throw error;
    }
}


async searchPersonsAdmin(filters: {
    names?: string;
    surnames?: string;
    identification?: string;
    state?: boolean;
}): Promise<Person[]> {
    const query = this.personRepository.createQueryBuilder('person');

    if (filters.names) {
        query.andWhere('LOWER(person.names) LIKE LOWER(:names)', { names: `%${filters.names}%` });
    }

    if (filters.surnames) {
        query.andWhere('LOWER(person.surnames) LIKE LOWER(:surnames)', { surnames: `%${filters.surnames}%` });
    }

    if (filters.identification) {
        query.andWhere('person.identification = :identification', { identification: filters.identification });
    }

    if (filters.state !== undefined) {
        query.andWhere('person.state = :state', { state: filters.state });
    }

    return query.getMany();
}


async patchPerson(idPerson: number, state: boolean): Promise<Person>{
    const person = await this.personRepository.findOne({ where: { idPerson } });
    
        if (!person) {
            throw new NotFoundException('Persona no encontrada');
        }
    
        person.state = state;
        await this.personRepository.save(person);

        return person
    }
}