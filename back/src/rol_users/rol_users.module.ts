import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolUsers } from "./rol_users.entity";
import { RolUsersService } from "./rol_users.service";
import { RolUsersController } from "./rol_users.controller";
import { Rol } from "src/rol/rol.entity";
import { User } from "src/users/users.entity";

@Module({
    imports: [TypeOrmModule.forFeature([RolUsers, Rol, User])],
    providers: [ RolUsersService],
    controllers: [RolUsersController],
    exports: [RolUsersService]
})
export class RolUsersModule{}