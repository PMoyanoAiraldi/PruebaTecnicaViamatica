
import { IsInt, IsOptional } from "class-validator";

export class UpdateRolUsersDto {
    @IsOptional()
    @IsInt()
    rolId?: number;

    @IsOptional()
    @IsInt()
    userId?: number;
}