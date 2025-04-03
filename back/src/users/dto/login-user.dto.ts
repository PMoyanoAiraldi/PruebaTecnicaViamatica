import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {
    
    @IsString()
    @MinLength(8)
    @Matches(/[A-Z]/, { message: 'La contraseña debe contener al menos una letra mayúscula' })
    @Matches(/[!@#$%^&*(),.?":{}|<>]/, { message: 'La contraseña debe contener al menos un signo' })
    @Matches(/^\S*$/, { message: 'La contraseña no debe contener espacios' })
    password: string;

    @ApiProperty({ example: 'example@email.com o username', description: 'Correo o nombre de usuario' })
    @IsNotEmpty()
    @MaxLength(50)
    identifier: string;// Puede ser email o username

}