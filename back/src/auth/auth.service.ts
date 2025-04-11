import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SessionsService } from "src/sessions/sessions.service";
import { UsersService } from "src/users/users.service";
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from "src/users/dto/login-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/users.entity";
import { Repository } from "typeorm";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private sessionsService: SessionsService,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async login(loginDto: LoginUserDto) {
        console.log("Intentando login con:", loginDto);
        const { identifier, password } = loginDto;
    
        const user = await this.usersService.findByUsernameOrEmail(identifier);
        if (!user) throw new NotFoundException('Usuario no encontrado');
    
        if (user.status === 'bloqueado') {
            throw new ForbiddenException('Usuario bloqueado. Contacte con soporte.');
        }
    
        const isPasswordValid = await (bcrypt.compare(password, user.password) as Promise<boolean>);

        if (!isPasswordValid) {
            await this.usersService.incrementFailedAttempts(user.idUser);
            throw new UnauthorizedException('Contraseña incorrecta.');
        }
    
        //  Reiniciar intentos fallidos
        await this.usersService.resetFailedAttempts(user.idUser);
    
        //  Verificar si ya tiene una sesión activa
        const activeSession = await this.sessionsService.getActiveSession(user.idUser);
        if (activeSession) {
            throw new UnauthorizedException('Ya tienes una sesión activa.');
        }
    
        //  Crear una nueva sesión
        await this.sessionsService.createSession(user);
    
        // Obtener rol de forma segura
        const role =  user?.rolesUsers?.length > 0 && user.rolesUsers[0]?.rol?.rolName
            ? user.rolesUsers[0].rol.rolName
            : 'USER';

        // Generar JWT
        const payload: { sub: number; role: string;  email:string} = { 
            sub: user.idUser, 
            email: user.email,
            role,
        };
        return {
            access_token: this.jwtService.sign(payload),
            id:user.idUser,
            message: 'Inicio de sesión exitoso',
        };

        
    }
    
    async logout(userId: number) {
        const session = await this.sessionsService.getActiveSession(userId);
        if (!session) throw new NotFoundException('No hay sesión activa.');
        await this.sessionsService.closeSession(session.id);
        return { message: 'Sesión cerrada correctamente' };
    }


    async resetPassword(resetDto: ResetPasswordDto): Promise<{ message: string }> {
        const { identifier, password } = resetDto;
    
        const user = await this.usersRepository.findOne({
            where: [
                { email: identifier },
                { username: identifier },
            ],
            });
        
            if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const hashedPassword = await bcrypt.hash(password, 10);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        await this.usersRepository.update(user.idUser, { password: hashedPassword });
    
        return { message: 'Contraseña actualizada con éxito' };
    }

}
