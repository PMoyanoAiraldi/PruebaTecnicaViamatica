import { IsString } from "class-validator";

export class MenuItemDto {

    @IsString()
    label: string;

    @IsString()
    path: string;
}