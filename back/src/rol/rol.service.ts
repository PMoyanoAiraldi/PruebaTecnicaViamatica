import {  HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Rol } from "./rol.entity";
import { Repository } from "typeorm";
import { CreateRolDto } from "./dto/create-rol.dto";
import { UpdateRolDto } from "./dto/update-rol.dto";

@Injectable()
export class RolService {
    constructor(
        @InjectRepository(Rol)
        private readonly rolRepository: Repository<Rol>,
            
    ) { }

    async createRol(createRolDto: CreateRolDto): Promise<Rol>{
        const { rolName } = createRolDto;

        const existingRol = await this.rolRepository.findOne({ where: { rolName } });

        if (existingRol) {
            throw new HttpException(
                `El rol con nombre '${rolName}' ya existe.`,
                HttpStatus.BAD_REQUEST)
        }

        const rol = this.rolRepository.create(createRolDto);
        return await this.rolRepository.save(rol);
    }

    async getRol(): Promise<Rol[]>{
        const rol = this.rolRepository.find()
        return rol
    }

    async getRolId(idRol: number): Promise<Rol>{
        const rol = await this.rolRepository.findOne({where:{idRol}  })
    
        if (!rol) {
            throw new NotFoundException(`Rol con ID ${idRol} no encontrado`);
        }
    
        return rol
    }

    async updateRol(idRol: number, updateRolDto: UpdateRolDto): Promise<Rol>{
        const rol = await this.rolRepository.findOne({ where: { idRol } });
        if (!rol) {
            throw new Error(`Rol con ${idRol} no fue encontrado`);
        }
        const updateData = {
            rolName: updateRolDto.rolName || rol.rolName,  
        };
            
        await this.rolRepository.save({ ...rol, ...updateData });
    
        return { ...rol, ...updateData };
    }

    async patchRol(idRol: number, state: boolean): Promise<Rol>{
        const rol = await this.rolRepository.findOne({ where: { idRol } });
        
            if (!rol) {
                throw new NotFoundException('Rol no encontrado');
            }
        
            rol.state = state;
            await this.rolRepository.save(rol);
    
            return rol
        }


}