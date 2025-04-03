import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RolOptionsService } from "./rol_options.service";

@ApiTags("Rol Options")
@Controller("rolOptions")
export class RolOptionsController {
    constructor(
        private readonly rolOptionsService: RolOptionsService,
) { }
}