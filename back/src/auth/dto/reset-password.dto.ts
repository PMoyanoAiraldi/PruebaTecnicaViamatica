import { IsString, IsNotEmpty, MaxLength, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    @ApiProperty({
        example: 'Example123!',
        description: 'Nueva contraseña (mínimo 8 caracteres, una mayúscula, un símbolo, sin espacios)',
    })
    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/[A-Z]/, { message: 'La contraseña debe contener al menos una letra mayúscula' })
    @Matches(/[!@#$%^&*(),.?":{}|<>]/, { message: 'La contraseña debe contener al menos un signo' })
    @Matches(/^\S*$/, { message: 'La contraseña no debe contener espacios' })
    password: string;

    @ApiProperty({
        example: 'example@email.com o username',
        description: 'Correo electrónico o nombre de usuario',
    })
    @IsString()
    @IsNotEmpty({ message: 'El identificador no puede estar vacío' })
    @MaxLength(50, { message: 'El identificador no debe superar los 50 caracteres' })
    identifier: string;
}