import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RolUsersService } from "./rol_users.service";

@ApiTags("Rol User")
@Controller("rolUsers")
export class RolUsersController {
    constructor(
        private readonly rolUsersService: RolUsersService,
) { }
}