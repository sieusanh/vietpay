import { ApiProperty } from '@nestjs/swagger';

export class QueryParams {
    // key, value is viewed as or if value have prefix "|"
    @ApiProperty({
        default: '',
    })
    select?: string;

    @ApiProperty({
        default: 0,
    })
    offset?: number = 0;

    @ApiProperty({
        default: 20,
    })
    limit?: number = 20;

    // GET /ccadmin/v1/products?sort=id:desc,name:asc
    @ApiProperty({
        required: false,
    })
    sort?: string;

    @ApiProperty({})
    from_time?: string;

    @ApiProperty({})
    to_time?: string;

    @ApiProperty({})
    populate?: string;
}
