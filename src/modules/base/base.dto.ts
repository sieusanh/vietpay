import { IsString, IsDate, IsOptional } from 'class-validator';
import { CODE } from 'src/common';
import { ApiProperty } from '@nestjs/swagger';

export class BaseDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
    })
    code: CODE = '';

    // @IsInt()
    // @IsOptional()
    // @IsEnum(STATUS)
    // @ApiProperty({ enum: Object.keys(STATUS) })
    // status: number = 1;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    createdAt: Date = new Date();

    @IsDate()
    @IsOptional()
    @ApiProperty()
    updatedAt: Date = new Date();

    @IsString()
    @IsOptional()
    @ApiProperty()
    createdBy: string = '';

    @IsString()
    @IsOptional()
    @ApiProperty()
    updatedBy: string = '';
}

export interface BaseResponseDataDto<T> {
    total: number;
    data: Array<T>;
}
