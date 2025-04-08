import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsString, Length, MaxLength } from "class-validator";


export class CreatePersonDto {
    @IsString()
    @MaxLength(60)
    names: string;

    @IsString()
    @MaxLength(60)
    surnames: string;

    @IsString()
    @Length(10, 10, { message: 'La identificación debe tener exactamente 10 dígitos.' })
    identification: string;

    @ApiProperty({ type: String, format: 'date' })
    @Type(() => Date)
    @IsDate({ message: 'La fecha debe tener formato válido (YYYY-MM-DD)' })
    dateBirth: Date;


}