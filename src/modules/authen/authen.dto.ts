import { Injectable } from '@nestjs/common';
import { IsString, IsEmail, IsDate, IsNotEmpty, Matches, 
    IsEnum, IsOptional } from 'class-validator';
import { BaseDto } from 'src/modules/base';
import { ApiProperty } from '@nestjs/swagger';
import { GENDERS, CODE } from 'src/common';

@Injectable()
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
    @Matches(/^[a-zA-Z ]+$/)
    full_name: string = '';
    
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
    role_code?: CODE;
    
    @ApiProperty()
    @IsDate()
    last_login_at?: Date = new Date();
}


@Injectable()
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
