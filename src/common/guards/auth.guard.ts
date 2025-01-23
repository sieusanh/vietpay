import { Injectable, CanActivate, ExecutionContext, 
    UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { CONFIG_KEYS } from 'common/config';

interface IUser {
    name: string;
}

interface IRequestInfo {
    user: IUser;
}

type RequestInfo = Request<IRequestInfo>;

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();

        console.log('================= request ', request)
        
        return this.validateRequest(request);
    }

    private extractTokenFromHeader(requestInfo: RequestInfo): string | undefined {
        const [type, token] = requestInfo.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    async validateRequest(requestInfo: RequestInfo): Promise<boolean> {

        const token = this.extractTokenFromHeader(requestInfo);
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const secret = this.configService.get<string>(CONFIG_KEYS.JWT_SECRET_KEY);
            const payload = await this.jwtService.verifyAsync(
                token,
                { secret }
            );
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers

            requestInfo.user = payload;
        } catch (err) {
            throw new UnauthorizedException();
        }

        return true;
    }
}
