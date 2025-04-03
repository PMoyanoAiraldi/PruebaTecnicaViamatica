import {  Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    
    ) { }


async createUser(createUserDto: CreateUserDto): Promise<User> {
    
    let email = createUserDto.email;
    let count = 1;

    while (await this.usersRepository.findOne({ where: { email } })) {
        const [username, domain] = createUserDto.email.split("@");
        email = `${username}${count}@${domain}`;
        count++;
    }
    console.log(`"${createUserDto.username}"`, createUserDto.username.length);
    if (typeof createUserDto.password !== 'string') {
        throw new Error("Contraseña inválida");
    }
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const newUser = this.usersRepository.create({ ...createUserDto, password: hashedPassword, email });
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
        where: [{ email: identifier }, { username: identifier }],
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

}