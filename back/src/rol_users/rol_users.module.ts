import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolUsers } from "./rol_users.entity";
import { RolUsersService } from "./rol_users.service";
import { RolUsersController } from "./rol_users.controller";

@Module({
    imports: [TypeOrmModule.forFeature([RolUsers])],
    providers: [ RolUsersService],
    controllers: [RolUsersController],
    exports: [RolUsersService]
})
export class RolUsersModule{}