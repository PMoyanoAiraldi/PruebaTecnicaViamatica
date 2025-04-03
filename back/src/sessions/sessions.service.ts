import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Sessions } from "./sessions.entity";
import { Repository } from "typeorm";
import { User } from "src/users/users.entity";
import { IsNull } from 'typeorm';

@Injectable()
export class SessionsService {
    constructor(
        @InjectRepository(Sessions)
        private readonly sessionsRepository: Repository<Sessions>,
    ) { }

    async getActiveSession(idUser: number) {
        return this.sessionsRepository.findOne({
            where: { users: { idUser }, closingDate: IsNull() },
            relations: ['users'],
        });
        }
    
        async createSession(users: User) {
        const session = this.sessionsRepository.create({ users });
        return this.sessionsRepository.save(session);
        }
    
        async closeSession(sessionId: number) {
        return this.sessionsRepository.update(sessionId, { closingDate: new Date() });
        }
    }
