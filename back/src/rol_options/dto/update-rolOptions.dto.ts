import { IsInt, IsOptional, IsString, Length } from "class-validator";

export class UpdateRolOptionsDto{
    @IsOptional()
    @IsString()
    @Length(1, 50)
    nameOption?: string;

    @IsOptional()
    @IsInt()
    rolId?: number
}