import {
    IsString,
    IsEmail,
    IsDate,
    IsNotEmpty,
    Matches,
    IsEnum,
    IsOptional,
    ValidateIf,
} from 'class-validator';
import { Expose, Exclude, Type } from 'class-transformer';
import {
    BaseResponseDto,
    BaseResponseDataList,
} from 'src/feature-modules/base';
import { ApiProperty } from '@nestjs/swagger';
import { CODE, GENDERS } from 'common/types';

export class CreateAccountDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @ValidateIf((o) => !o.email && !o.phone)
    username: string = '';

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ValidateIf((o) => !o.username && !o.phone)
    email?: string = '';

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Matches(/^[+ 0-9]{8,18}$/)
    @ValidateIf((o) => !o.username && !o.email)
    phone?: string = '';

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string = '';

    @ApiProperty()
    @IsString()
    @Expose({ name: 'full_name' })
    @Matches(/^[a-zA-Z ]+$/)
    fullName: string = '';

    @ApiProperty()
    @IsString()
    @IsOptional()
    avatar?: string = '';

    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsEnum(Object.values(GENDERS))
    gender?: string = GENDERS.MALE;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Expose({ name: 'role_code' })
    roleCode?: CODE;
}

export class ResponseAccountDto extends BaseResponseDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @ValidateIf((o) => !o.email && !o.phone)
    username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ValidateIf((o) => !o.username && !o.phone)
    email?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Matches(/^[+ 0-9]{8,18}$/)
    @ValidateIf((o) => !o.username && !o.email)
    phone?: string;

    @Exclude()
    password: string;

    @ApiProperty()
    @IsString()
    @Expose({ name: 'full_name', toPlainOnly: true })
    @Matches(/^[a-zA-Z ]+$/)
    fullName: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    avatar?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsEnum(Object.values(GENDERS))
    gender?: string = GENDERS.MALE;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Expose({ name: 'role_code', toPlainOnly: true })
    roleCode?: CODE;

    @ApiProperty()
    @IsDate()
    @Expose({ name: 'last_login_at', toPlainOnly: true })
    lastLoginAt?: Date = new Date();

    // constructor(partial: Partial<ResponseAccountDto>) {
    //     super(partial);
    //     Object.assign(this, partial);
    // }
}

export class ResponseAccountListDto extends BaseResponseDataList<ResponseAccountDto> {
    @Type(() => ResponseAccountDto)
    @ApiProperty({
        description: 'Data list',
        default: [],
        example: [],
    })
    data: Array<ResponseAccountDto>;
}
