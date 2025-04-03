import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RolUsers } from "./rol_users.entity";
import { Repository } from "typeorm";

@Injectable()
export class RolUsersService {
    constructor(
        @InjectRepository(RolUsers)
        private readonly rolUsersRepository: Repository<RolUsers>,
            
    ) { }
}