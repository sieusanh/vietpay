
import { IsNumberString, IsString, IsNotEmpty } from 'class-validator';
import { CODE } from 'src/common';

export class PathParams {

    @IsString()
    @IsNotEmpty()
    code?: CODE;
    
}
