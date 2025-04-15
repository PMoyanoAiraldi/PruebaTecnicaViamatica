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
import { Rol } from "src/rol/rol.entity";
import { RolUsers } from "src/rol_users/rol_users.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,

        @InjectRepository(Person)
        private readonly personRepository: Repository<Person>,

        @InjectRepository(Rol)
        private rolRepository: Repository<Rol>,
        
        @InjectRepository(RolUsers)
        private rolUsersRepository: Repository<RolUsers>,
    
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

    const savedUser = await this.usersRepository.save(newUser);

    
    const defaultRole = await this.rolRepository.findOne({ where: { rolName: 'Usuario' } });
    if (!defaultRole) {
        throw new NotFoundException("No se encontró el rol 'Usuario'");
    }

    const userRole = this.rolUsersRepository.create({
        user: savedUser,
        rol: defaultRole,
        state: true
    });

    await this.rolUsersRepository.save(userRole);

    return savedUser;

}

async getUserForId(idUser: number): Promise<User> {
    if (!idUser || idUser <= 0) {
        throw new BadRequestException('El ID del usuario debe ser un número positivo');
    }
    // const user = await this.usersRepository.findOne({
    //     where: { idUser: idUser },
    //     relations: ['rolesUsers', 'rolesUsers.rol', 'person'],
    // });

    const user = await this.usersRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.person', 'person') // Asegúrate de que la relación person esté siendo unida correctamente
    .leftJoinAndSelect('user.rolesUsers', 'rolesUsers')
    .leftJoinAndSelect('rolesUsers.rol', 'rol')
    .where('user.idUser = :idUser', { idUser })
    .getOne();
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
    
async getUsersWithDetails(): Promise<User[]> {
        return await this.usersRepository.find({
            relations: ['person', 'rolesUsers', 'rolesUsers.rol'],
        });
    }


        async searchUsersByPersonData(filters: {
            names?: string;
            surnames?: string;
            identification?: string;
            state?: string;
        }): Promise<User[]> {
            const query = this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.person', 'person'); // Relación con persona
        
            if (filters.names) {
            query.andWhere('LOWER(person.names) LIKE LOWER(:names)', {
                names: `%${filters.names}%`,
            });
            }
        
            if (filters.surnames) {
            query.andWhere('LOWER(person.surnames) LIKE LOWER(:surnames)', {
                surnames: `%${filters.surnames}%`,
            });
            }
        
            if (filters.identification) {
            query.andWhere('person.identification = :identification', {
                identification: filters.identification,
            });
            }
        
            if (filters.state) {
            query.andWhere('user.status = :status', { status: filters.state });
            }
        
            return await query.getMany();
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
        try {
            await this.createUser(row); 
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


    async getDashboardStats() {
            const users = await this.usersRepository.find();
        
            const activos = users.filter(u => u.status === 'activo').length;
            const inactivos = users.filter(u => u.status === 'inactivo').length;
            const bloqueados = users.filter(u => u.status === 'bloqueado').length;
            const fallidos = users.reduce((acc, user) => acc + (user.failedAttempts || 0), 0);
        
            return {
            activos,
            inactivos,
            bloqueados,
            fallidos,
            };
        }
}