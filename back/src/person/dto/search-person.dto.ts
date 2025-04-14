import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString, Length, MaxLength, } from "class-validator";

export class SearchPersonDto {
    @ApiProperty({ type: String, example: 'Marcelo', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(60)
    names?: string;

    @ApiProperty({ type: String, example: 'Moyano', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(60)
    surnames?: string;


    @ApiProperty({ type: String, example: '1234567890', required: false })
    @IsOptional()
    @IsString()
    @Length(10, 10, { message: 'La identificación debe tener exactamente 10 dígitos.' })
    identification?: string;

    @ApiProperty({
        description: 'Indica si el usuario está habilitado (true) o deshabilitado (false)',
        example: true, 
        required: false 
    })
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    state?: boolean;

}