import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RolUsers } from "./rol_users.entity";
import { Repository } from "typeorm";
import { CreateRolUsersDto } from "./dto/create-rolUser.dto";
import { User } from "src/users/users.entity";
import { Rol } from "src/rol/rol.entity";
import { UpdateRolUsersDto } from "./dto/update-rolUser.dto";

@Injectable()
export class RolUsersService {
    constructor(
        @InjectRepository(RolUsers)
        private readonly rolUsersRepository: Repository<RolUsers>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Rol)
        private readonly rolRepository: Repository<Rol>,
        
            
    ) { }

    async createRolUsers(createRolUsersDto: CreateRolUsersDto): Promise<RolUsers>{
            const { userId, rolId } = createRolUsersDto;
        
            const user = await this.usersRepository.findOne({ where: { idUser: userId } });
        
                if (!user) {
                    throw new HttpException(
                    `Usuario con ID '${userId}' no encontrado.`,
                    HttpStatus.BAD_REQUEST)
                }
        
            const rol = await this.rolRepository.findOne({where: {idRol: rolId}})
    
                if (!rol) {
                    throw new HttpException(`Rol con ID '${rolId}' no encontrado.`, HttpStatus.NOT_FOUND);
                }
    
            const rolUsers = this.rolUsersRepository.create({ user, rol});
            return await this.rolUsersRepository.save(rolUsers);
            }

    async getRolUsers(): Promise<RolUsers[]>{
        const rolUsers = this.rolUsersRepository.find({
            relations: ['user', 'rol'],
        });
        return rolUsers
    }
            
    async getRolUsersId(id: number): Promise<RolUsers>{
        const rolUsers = await this.rolUsersRepository.findOne({
            where:{id},
            relations: ['user', 'rol'],
    })
                
        if (!rolUsers) {
            throw new NotFoundException(`Relacion de rol con ID ${id} no encontrada`);
        }
                
        return rolUsers
    }
            
    async updateRolUsers(id: number, updateRolUsersDto: UpdateRolUsersDto): Promise<RolUsers>{
        const rolUser = await this.rolUsersRepository.findOne({ where: { id } });

        if (!rolUser) {
            throw new Error(`Relacion de rol con ${id} no fue encontrada`);
        }
    
        const { rolId, userId } = updateRolUsersDto;

        if (rolId) {
            const rol = await this.rolRepository.findOne({ where: { idRol: rolId } });

        if (!rol) {
            throw new NotFoundException(`Rol con id ${rolId} no encontrado.`);
        }
        rolUser.rol = rol;
}

        if (userId) {
            const user = await this.usersRepository.findOne({ where: { idUser: userId } });
        if (!user) {
            throw new NotFoundException(`Usuario con id ${userId} no encontrado.`);
        }
        rolUser.user = user;
}

        return await this.rolUsersRepository.save(rolUser);
}
    
    async patchRolUsers(id: number, state: boolean): Promise<RolUsers>{
        const rolUsers = await this.rolUsersRepository.findOne({ where: { id } });
                        
        if (!rolUsers) {
            throw new NotFoundException('Relacion de rol  no encontrada');
    }
                        
        rolUsers.state = state;
        await this.rolUsersRepository.save(rolUsers);
                    
        return rolUsers
}        

}