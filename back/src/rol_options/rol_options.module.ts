import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolOptions } from "./rol_options.entity";
import { RolOptionsService } from "./rol_options.service";
import { RolOptionsController } from "./rol_options.controller";
import { Rol } from "src/rol/rol.entity";

@Module({
    imports: [TypeOrmModule.forFeature([RolOptions, Rol])],
    providers: [ RolOptionsService],
    controllers: [RolOptionsController],
    exports: [RolOptionsService]
})
export class RolOptionsModule{}