import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Rol } from "./rol.entity";
import { Repository } from "typeorm";

@Injectable()
export class RolService {
    constructor(
        @InjectRepository(Rol)
        private readonly rolRepository: Repository<Rol>,
            
    ) { }
}