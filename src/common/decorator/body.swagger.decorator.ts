import { applyDecorators } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

type ApiBodyObj = {
    description?: string;
    examples?: {
        default: {
            value: 0;
        };
    };
};

export function BaseApiBody({ description, examples }: ApiBodyObj) {
    return applyDecorators(
        ApiBody({
            description,
            examples,
        }),
    );
}
