import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RolOptions } from "./rol_options.entity";
import { Repository } from "typeorm";

@Injectable()
export class RolOptionsService {
    constructor(
        @InjectRepository(RolOptions)
        private readonly rolOptionRepository: Repository<RolOptions>,
            
    ) { }
}