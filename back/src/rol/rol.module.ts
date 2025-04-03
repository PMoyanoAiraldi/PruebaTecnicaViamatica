import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Rol } from "./rol.entity";
import { RolController } from "./rol.controller";
import { RolService } from "./rol.service";

@Module({
    imports: [TypeOrmModule.forFeature([Rol])],
    providers: [ RolService],
    controllers: [RolController],
    exports: [RolService]
})
export class RolModule{}