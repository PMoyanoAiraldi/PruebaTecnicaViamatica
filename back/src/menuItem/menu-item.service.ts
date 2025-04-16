import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { MenuItem } from './menu-item.entity';
import { Rol } from 'src/rol/rol.entity';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(MenuItem)
        private readonly menuRepository: Repository<MenuItem>,

        private readonly usersService: UsersService,

        @InjectRepository(Rol)
        private readonly rolRepository: Repository<Rol>
    ) {}

        async getMenuByUserId(userId: number): Promise<MenuItem[]> {
            const user = await this.usersService.findByIdWithRole(userId);
        
            if (!user) {
            throw new NotFoundException('Usuario no encontrado');
            }
        
            
            const rolUsuario = user.rolesUsers[0]?.rol;

            
        
            if (!rolUsuario) {
            throw new NotFoundException('Rol no asignado al usuario');
            }
        
            
            const menus = await this.menuRepository.find({
            where: {
                rol: { idRol: rolUsuario.idRol },
                isActive: true,
            },
            });
    
        return menus;
    }

    async onModuleInit() {
        const adminRol = await this.rolRepository.findOne({ where: { rolName: 'Administrador' } });
        const userRol = await this.rolRepository.findOne({ where: { rolName: 'Usuario' } });
    
        if (!adminRol || !userRol) {
            console.warn('⚠ No se encontraron los roles requeridos para precargar los menús');
            return;
            }
        
            const existingMenus = await this.menuRepository.find();
        
            if (existingMenus.length === 0) {
            const menuItems = [
                {
                label: 'Dashboard',
                path: '/dashboard',
                rol: adminRol,
                },
                {
                label: 'Mantenimiento de usuarios',
                path: '/user-maintenance',
                rol: adminRol,
                },
                {
                label: 'Bienvenida',
                path: '/welcome',
                rol: userRol,
                },
                {
                label: 'Mi perfil',
                path: '/profile',
                rol: userRol,
                },
            ];
        
            await this.menuRepository.save(menuItems);
        
            }
        }
    }