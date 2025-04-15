import { Controller, Delete, Get, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { SessionsService } from "./sessions.service";
import { Roles } from "src/decorators/roles.decorators";
import { RolesGuard } from "src/guard/roles.guard";
import { AuthGuard } from "src/guard/auth.guard";

@ApiTags("Sessions")
@Controller("sessions")
export class SessionsController {
    constructor(
        private readonly sessionsService: SessionsService,
) { }

    @Get()
    async findAll() {
        return this.sessionsService.findAll();
    }

    @Delete(':id')
    async closeSession(@Param('id', ParseIntPipe) id: number) {
        await this.sessionsService.closeSession(id);
        return { message: 'Sesión cerrada correctamente' };
    }

    
    @Get('active/:userId')
    async getActiveSession(@Param('userId', ParseIntPipe) userId: number) {
        return this.sessionsService.getActiveSession(userId);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('Administrador')
    @ApiBearerAuth()   
    @Get(':id')
    async getSessionId(@Param('id', ParseIntPipe) id: number){
        return await this.sessionsService.getSessionForId(id)
    }


}
