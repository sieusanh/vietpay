import {
    IsString,
    IsDate,
    IsOptional,
    IsNotEmpty,
    IsEnum,
    IsNumber,
    IsArray,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { CODE, STATUS_STRING } from 'common/types';
import { ApiProperty } from '@nestjs/swagger';

export class BaseDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: 'string',
    })
    code: CODE = '';

    @IsString()
    @IsOptional()
    @IsEnum(STATUS_STRING)
    @ApiProperty({ enum: Object.keys(STATUS_STRING) })
    status: string = STATUS_STRING.ACTIVE;

    @IsDate()
    @IsOptional()
    @ApiProperty()
    createdAt: Date = new Date();

    @IsString()
    @IsOptional()
    @ApiProperty()
    createdBy: string = '';
}

export class BaseResponseDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: 'string',
    })
    code: CODE = '';

    @IsString()
    @IsOptional()
    @IsEnum(STATUS_STRING)
    @ApiProperty({ enum: Object.keys(STATUS_STRING) })
    status: string = STATUS_STRING.ACTIVE;

    @IsDate()
    @IsOptional()
    @ApiProperty()
    @Expose({ name: 'created_at', toPlainOnly: true })
    createdAt: Date = new Date();

    @IsString()
    @IsOptional()
    @ApiProperty()
    @Expose({ name: 'created_by', toPlainOnly: true })
    createdBy: string = '';

    @Exclude()
    updatedAt: Date;

    @Exclude()
    _id: string;

    @Exclude()
    _v: number;

    constructor(partial: Partial<BaseResponseDto>) {
        Object.assign(this, partial);
    }
}

export class BaseResponseDataList<Dto extends BaseResponseDto> {
    @IsNumber()
    @ApiProperty({
        description: 'Total',
        minimum: 0,
        default: 0,
        example: 1000,
    })
    total: number;

    @IsArray()
    // @Type(() => Dto)
    @ApiProperty({
        description: 'Data list',
        default: [],
        example: [],
    })
    data: Array<Dto>;

    // constructor(protected responseDto: Dto) {}

    // constructor(partial: Partial<BaseResponseDataList<Dto>>) {
    //     Object.assign(this, partial);
    // }
}
