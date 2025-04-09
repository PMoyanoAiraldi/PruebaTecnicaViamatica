import { IsInt, IsString, Length } from "class-validator";

export class CreateRolOptionsDto{
    @IsString()
    @Length(1, 50)
    nameOption: string;

    @IsInt()
    rolId: number
}