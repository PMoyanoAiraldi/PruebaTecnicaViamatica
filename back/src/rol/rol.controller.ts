import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RolService } from "./rol.service";

@ApiTags("Rol ")
@Controller("rol")
export class RolController {
    constructor(
        private readonly rolService: RolService,
) { }
}