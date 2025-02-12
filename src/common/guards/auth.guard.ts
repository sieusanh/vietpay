import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Optional,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from 'src/common/constants';
import { IRequestInfo } from 'common/types';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        @Optional() private configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<IRequestInfo>();

        console.log('================= request ', request);

        return this.validateRequest(request);
    }

    private extractTokenFromHeader(
        requestInfo: IRequestInfo,
    ): string | undefined {
        const [type, token] =
            requestInfo.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    async validateRequest(requestInfo: IRequestInfo): Promise<boolean> {
        // const token = this.extractTokenFromHeader(requestInfo);
        // if (!token) {
        //     throw new UnauthorizedException();
        // }

        try {
            const secret = this.configService.get<string>(
                CONFIG_KEYS.JWT_SECRET_KEY,
                'DEFAULT_KEY_ABC_123',
            );
            console.log('====================== secret ', secret);
            // const payload = await this.jwtService.verifyAsync(token, {
            //     secret,
            // });
            console.log(requestInfo);
            // requestInfo.account = payload;
        } catch (err) {
            console.log(err);
            throw new UnauthorizedException();
        }

        return true;
    }
}
