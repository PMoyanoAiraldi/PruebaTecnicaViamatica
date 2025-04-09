import {  IsEmail,  IsOptional, IsString, Length, Matches, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {

    @Length(8, 20)
    username?: string;

    @IsString()
    @MinLength(8)
    @Matches(/[A-Z]/, { message: 'La contraseña debe contener al menos una letra mayúscula' })
    @Matches(/[!@#$%^&*(),.?":{}|<>]/, { message: 'La contraseña debe contener al menos un signo' })
    @Matches(/^\S*$/, { message: 'La contraseña no debe contener espacios' })
    password?: string;

    @IsEmail()
    @IsOptional()
    @MaxLength(50)
    email?: string;


}