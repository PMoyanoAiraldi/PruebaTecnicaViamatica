import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class UpdateRolDto{
    @ApiProperty({ type: String, required: false })
    @IsString()
    @Length(1, 50)
    rolName?: string;
}