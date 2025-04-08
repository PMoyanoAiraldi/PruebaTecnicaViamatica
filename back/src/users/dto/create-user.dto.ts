import {  IsEmail, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/^[A-Za-z0-9]*$/, { message: 'El nombre de usuario no debe contener signos' })
    @Matches(/\d/, { message: 'El nombre de usuario debe contener al menos un número' })
    @Matches(/[A-Z]/, { message: 'El nombre de usuario debe contener al menos una letra mayúscula' })
    username: string;

    @IsString()
    @MinLength(8)
    @Matches(/[A-Z]/, { message: 'La contraseña debe contener al menos una letra mayúscula' })
    @Matches(/[!@#$%^&*(),.?":{}|<>]/, { message: 'La contraseña debe contener al menos un signo' })
    @Matches(/^\S*$/, { message: 'La contraseña no debe contener espacios' })
    password: string;

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(50)
    email: string;

    @MaxLength(20)
    @IsOptional()
    status?: string;  

    @IsInt()
    @IsPositive()
    personId?: number;  
}