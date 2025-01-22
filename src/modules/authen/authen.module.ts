import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthenController } from './authen.controller';
import { AuthenService } from './authen.service';
import { AccountsModule } from 'modules/accounts/accounts.module';
import { DataEntityFactory } from 'modules/base';
import { QueryParser } from 'common/http';
import { CONFIG_KEYS } from 'common/config';

@Global()
@Module({
    imports: [
        // FactoryModule
        JwtModule.registerAsync({
            global: true,
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>(CONFIG_KEYS.JWT_SECRET_KEY),
                signOptions: {
                    expiresIn: '60s'
                }
            }),
            inject: [ConfigService]
        }),
        AccountsModule
    ],
    controllers: [AuthenController],
    providers: [
        AuthenService, 
        DataEntityFactory,
        QueryParser,
    ],
})
export class AuthenModule {}
