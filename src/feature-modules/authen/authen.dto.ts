import {
    IsString,
    IsEmail,
    IsDate,
    IsNotEmpty,
    Matches,
    IsEnum,
    IsOptional,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseDto } from 'src/feature-modules/base';
import { ApiProperty } from '@nestjs/swagger';
import { GENDERS, CODE } from 'src/common';

export class RegistryDto extends BaseDto {
    @ApiProperty()
    @IsString()
    username: string = '';

    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsEmail()
    email?: string = '';

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Matches(/^[+ 0-9]{8,18}$/)
    phone?: string = '';

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string = '';

    @ApiProperty()
    @IsString()
    @Expose({ name: 'full_name' })
    // @Matches(/^[a-zA-Z ]+$/)
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

    @ApiProperty()
    @IsDate()
    @Expose({ name: 'last_login_at' })
    lastLoginAt?: Date = new Date();
}

export class SignInDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    username: string = '';

    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsEmail()
    email?: string = '';

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Matches(/^[+ 0-9]{8,18}$/)
    phone?: string = '';

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string = '';
}

export class ResponseSignInDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Expose({ name: 'access_token' })
    accessToken: string;
}
