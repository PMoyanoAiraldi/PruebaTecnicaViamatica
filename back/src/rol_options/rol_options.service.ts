import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RolOptions } from "./rol_options.entity";
import { Repository } from "typeorm";
import { CreateRolOptionsDto } from "./dto/create-rolOptions.dto";
import { Rol } from "src/rol/rol.entity";
import { UpdateRolOptionsDto } from "./dto/update-rolOptions.dto";

@Injectable()
export class RolOptionsService {
    constructor(
        @InjectRepository(RolOptions)
        private readonly rolOptionRepository: Repository<RolOptions>,

        @InjectRepository(Rol)
        private readonly rolRepository: Repository<Rol>
            
    ) { }

    async createRolOptions(createRolOptionsDto: CreateRolOptionsDto): Promise<RolOptions>{
        const { nameOption, rolId } = createRolOptionsDto;
    
        const existingRolOptions = await this.rolOptionRepository.findOne({ where: { nameOption } });
    
            if (existingRolOptions) {
                throw new HttpException(
                `La opcion de rol con nombre '${nameOption}' ya existe.`,
                HttpStatus.BAD_REQUEST)
            }
    
            const rol = await this.rolRepository.findOne({where: {idRol: rolId}})

            if (!rol) {
                throw new HttpException(`Rol con id '${rolId}' no encontrado.`, HttpStatus.NOT_FOUND);
            }

            const rolOption = this.rolOptionRepository.create({nameOption, rol});
            return await this.rolOptionRepository.save(rolOption);
        }

        async getRolOption(): Promise<RolOptions[]>{
            const rolOption = this.rolOptionRepository.find()
            return rolOption
        }
        
        async getRolOptionId(id: number): Promise<RolOptions>{
            const rolOption = await this.rolOptionRepository.findOne({where:{id}  })
            
            if (!rolOption) {
                throw new NotFoundException(`Opcion de rol con ID ${id} no encontrada`);
            }
            
            return rolOption
        }
        
        async updateRolOption(id: number, updateRolOptionDto: UpdateRolOptionsDto): Promise<RolOptions>{
            const rolOption = await this.rolOptionRepository.findOne({ where: { id } });
            if (!rolOption) {
                throw new Error(`Opcion de rol con ${id} no fue encontrada`);
            }

            if (updateRolOptionDto.nameOption) {
                rolOption.nameOption = updateRolOptionDto.nameOption;
            }
            
            if (updateRolOptionDto.rolId) {
                const rol = await this.rolRepository.findOne({ where: { idRol: updateRolOptionDto.rolId } });
            
            if (!rol) {
                throw new NotFoundException(`Rol con id ${updateRolOptionDto.rolId} no encontrado.`);
            }
            
                rolOption.rol = rol;
            }
            
            return await this.rolOptionRepository.save(rolOption);
        }

        async patchRolOption(id: number, state: boolean): Promise<RolOptions>{
            const rolOption = await this.rolOptionRepository.findOne({ where: { id } });
                    
            if (!rolOption) {
                throw new NotFoundException('Opcion de rol no encontrada');
        }
                    
            rolOption.state = state;
            await this.rolOptionRepository.save(rolOption);
                
            return rolOption
    }
}