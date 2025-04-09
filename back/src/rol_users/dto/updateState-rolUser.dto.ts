import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class UpdateStateRolUsersDto{
@ApiProperty({
    description: 'Indica si la relacion de rol está habilitada (true) o deshabilitada (false)',
    example: true, 
})
@IsBoolean()
state: boolean;
}