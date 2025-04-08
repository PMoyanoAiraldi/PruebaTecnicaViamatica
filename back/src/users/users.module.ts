import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { Person } from "src/person/person.entity";


@Module({
    imports: [TypeOrmModule.forFeature([User, Person])],
    providers: [ UsersService],
    controllers: [UsersController],
    exports: [UsersService]
})
export class UsersModule{}