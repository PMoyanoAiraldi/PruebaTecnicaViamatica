import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolOptions } from "./rol_options.entity";
import { RolOptionsService } from "./rol_options.service";
import { RolOptionsController } from "./rol_options.controller";

@Module({
    imports: [TypeOrmModule.forFeature([RolOptions])],
    providers: [ RolOptionsService],
    controllers: [RolOptionsController],
    exports: [RolOptionsService]
})
export class RolOptionsModule{}