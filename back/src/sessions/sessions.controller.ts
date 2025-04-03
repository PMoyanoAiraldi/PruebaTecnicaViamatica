import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SessionsService } from "./sessions.service";

@ApiTags("Sessions")
@Controller("sessions")
export class SessionsController {
    constructor(
        private readonly sessionsService: SessionsService,
) { }
}