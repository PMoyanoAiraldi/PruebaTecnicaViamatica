import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class UpdateStateRolOptionDto{
@ApiProperty({
    description: 'Indica si la opcion de rol está habilitada (true) o deshabilitada (false)',
    example: true, 
})
@IsBoolean()
state: boolean;
}