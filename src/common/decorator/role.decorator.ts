// import { Reflector } from "@nestjs/core";

// export const Roles = Reflector.createDecorator<string[]>();

import { SetMetadata } from '@nestjs/common';
import { METADATA_KEYS } from 'src/common/constants';

export const Roles = (...roles: string[]) =>
    SetMetadata(METADATA_KEYS.ROLES, roles);
