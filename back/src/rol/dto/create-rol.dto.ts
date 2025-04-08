import { IsString, Length } from "class-validator";

export class CreateRolDto{
    @IsString()
    @Length(1, 50)
    rolName: string;
}