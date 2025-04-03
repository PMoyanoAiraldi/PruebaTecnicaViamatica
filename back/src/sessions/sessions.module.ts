import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Sessions } from "./sessions.entity";
import { SessionsService } from "./sessions.service";
import { SessionsController } from "./sessions.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Sessions])],
    providers: [ SessionsService],
    controllers: [SessionsController],
    exports: [SessionsService]
})
export class SessionsModule{}