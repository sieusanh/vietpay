// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

// @Injectable()
// export class AuthGuard implements CanActivate {
//     canActivate(
//         context: ExecutionContext,
//     ): boolean | Promise<boolean> {
//         const request = context.switchToHttp().getRequest();
//         return validateRequest(request);
//     }
// }

// function validateRequest(request: unknown) {
//     return true;
// }

import { Injectable, CanActivate, ExecutionContext, 
    UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { CONFIG_KEYS } from 'common/config';

interface IUser {
    name: string;
}

type ContextRequest = Request<IUser>;

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<ContextRequest>();
        
        return this.validateRequest(request);
    }

    private extractTokenFromHeader(request: ContextRequest): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    async validateRequest(request: ContextRequest): Promise<boolean> {

        const token = this.extractTokenFromHeader(request);
        console.log('=================== token ', token)
        if (!token) {
            console.log('=================== here')

            // throw new UnauthorizedException();
        }

        try {
            const secret = this.configService.get<string>(CONFIG_KEYS.JWT_SECRET_KEY);
            console.log('================= secret ', secret)
            const payload = await this.jwtService.verifyAsync(
                token,
                { secret }
            );
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers

            request.user = payload;
        } catch (err) {
            console.log('======================= AuthGuard canActivate err ', err)
            throw new UnauthorizedException();
        }

        return true;
    }
}
