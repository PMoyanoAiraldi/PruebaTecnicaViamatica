import { ApiProperty } from "@nestjs/swagger";
import { IsEnum,  } from "class-validator";

export enum UserStatus {
    ACTIVO = 'activo',
    INACTIVO = 'inactivo',
}

export class UpdateStatusUserDto {
    @ApiProperty({
        enum: UserStatus,
        description: 'Estado del usuario: debe ser "activo" o "inactivo"',
        example: UserStatus.ACTIVO,
    })
    @IsEnum(UserStatus, { message: 'El status debe ser "activo" o "inactivo"' })
    status: UserStatus;
}