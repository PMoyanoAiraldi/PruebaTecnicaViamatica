import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class UpdateStateRolDto{
@ApiProperty({
    description: 'Indica si el rol está habilitado (true) o deshabilitado (false)',
    example: true, 
})
@IsBoolean()
state: boolean;
}