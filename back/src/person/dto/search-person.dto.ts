import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString, Length, MaxLength, } from "class-validator";

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

    @IsOptional()
    @ApiProperty({ type: String, format: 'date', required: false })
    @Type(() => Date)
    @IsDate({ message: 'La fecha debe tener formato válido (YYYY-MM-DD)' })
    dateBirth?: Date;


}