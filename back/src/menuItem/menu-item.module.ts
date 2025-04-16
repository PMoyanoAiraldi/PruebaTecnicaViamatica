import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { MenuItem } from './menu-item.entity';
import { MenuController } from './menu-item.controller';
import { MenuService } from './menu-item.service';
import { Rol } from 'src/rol/rol.entity';

@Module({
    imports: [TypeOrmModule.forFeature([MenuItem, Rol]), UsersModule],
    controllers: [MenuController],
    providers: [MenuService],
})
export class MenuModule {}