import { Injectable, NotFoundException } from "@nestjs/common";
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


    async createSession(user: User): Promise<Sessions> {
        const session = this.sessionsRepository.create({ 
            entryDate: new Date(),
            
            users: user, 
        });
        return await this.sessionsRepository.save(session);
    }



    async getActiveSession(idUser: number): Promise<Sessions | null> {
        return this.sessionsRepository.findOne({
            where: { users: { idUser }, closingDate: IsNull() },
            relations: ['users'],
        });
        }
    
        async closeSession(sessionId: number): Promise<void> {
            const session = await this.sessionsRepository.findOne({ where: { id: sessionId } });
            if (!session) throw new NotFoundException('Sesión no encontrada');
        
            session.closingDate = new Date();
            await this.sessionsRepository.save(session);
        }
        
        async findAll(): Promise<Sessions[]> {
            return this.sessionsRepository.find({ relations: ['users'] });
        }

        async getSessionForId(sessionId: number): Promise<Sessions> {
            const session = await this.sessionsRepository.findOne({ where: { id: sessionId } });
        
            if (!session) {
                throw new NotFoundException(`Session con ID ${sessionId} no encontrada`);
            }
        
            return session;
        }
    }
