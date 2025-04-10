import {  BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import { Person } from "src/person/person.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as fs from 'fs';
import * as XLSX from 'xlsx';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,

        @InjectRepository(Person)
        private readonly personRepository: Repository<Person>
    
    ) { }


async createUser(createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto.personId) {
        throw new BadRequestException("Se requiere el ID de la persona para crear el usuario");
    }
    let email = createUserDto.email;
    let count = 1;

    while (await this.usersRepository.findOne({ where: { email } })) {
        const [username, domain] = createUserDto.email.split("@");
        email = `${username}${count}@${domain}`;
        count++;
    }
    console.log(`"${createUserDto.username}"`, createUserDto.username.length);


    const person = await this.personRepository.findOne({ where: { idPerson: createUserDto.personId } });
    if (!person) {
    throw new NotFoundException('La persona con ese ID no existe');
}

    const existingUser = await this.usersRepository.findOne({ where: { person: { idPerson: createUserDto.personId } } });
    if (existingUser) {
        throw new BadRequestException('Esa persona ya tiene un usuario registrado');
    }
    console.log('Persona ya tiene usuario?', existingUser);


    if (typeof createUserDto.password !== 'string') {
        throw new Error("Contraseña inválida");
    }
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const newUser = this.usersRepository.create({ ...createUserDto, password: hashedPassword, email, person});
    return this.usersRepository.save(newUser);
}

async getUserForId(idUser: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { idUser } });

    if (!user) {
        throw new NotFoundException(`Usuario con ID ${idUser} no encontrado`);
    }

    return user;
}

async findByUsernameOrEmail(identifier: string): Promise<User | null> {
    return this.usersRepository.findOne({
        where: [
            { email: identifier }, 
            { username: identifier }
        ],
        relations: ['rolesUsers', 'rolesUsers.rol']
    });
}

    async incrementFailedAttempts(userId: number) {
    const user = await this.usersRepository.findOne({ where: { idUser: userId } });
    if (!user) return;

    user.failedAttempts += 1;
    if (user.failedAttempts >= 3) {
        user.status = 'bloqueado';
    }

    await this.usersRepository.save(user);
}

    async resetFailedAttempts(userId: number) {
    await this.usersRepository.update(userId, { failedAttempts: 0 });
}


async getUsers(): Promise<User[]>{
    const users =  await this.usersRepository.find()
    return users
}

async updateUsers(idUser: number,updateUserDto: UpdateUserDto): Promise<User>{
    const user = await this.usersRepository.findOne({ where: { idUser } });
    if (!user) {
        throw new Error(`Usuario con ${idUser} no fue encontrado`);
    }

    const updateData = {
        username: updateUserDto.username || user.username,  
        password: updateUserDto.password || user.password,        
        email: updateUserDto.email || user.email,  
        
    };
        
    
    await this.usersRepository.save({ ...user, ...updateData });

    return { ...user, ...updateData };

}

async patchUser(idUser: number, status: string): Promise<User>{
    const user = await this.usersRepository.findOne({ where: { idUser } });
    
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
    
        user.status = status;
        await this.usersRepository.save(user);

        return user
    }

    async loadUsersFromExcel(filePath: string): Promise<{ created: number; errors: string[] }> {
        
        const fileBuffer = fs.readFileSync(filePath);
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json<CreateUserDto>(workbook.Sheets[sheetName]);
    
        const errors: string[] = [];
        let created = 0;

        for (const row of data) {
          // Validar y crear cada usuario (puede ser con this.createUser(row))
        try {
            await this.createUser(row); // tu lógica de creación de usuario
            created++;
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Error al crear usuario ${row.username}:`, error.message);
                errors.push(`Error al crear usuario ${row.username}: ${error.message}`);
            } else {
                errors.push(`Error desconocido al crear usuario ${row.username}`);
            }
        }
    
        console.log('Usuarios cargados desde Excel.');
    }
    return {
        created,
        errors,
    };

    }
}