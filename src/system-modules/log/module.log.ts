import { Module, Global } from '@nestjs/common';
import { ConsoleService } from './service.log';

@Global()
@Module({
    providers: [ConsoleService],
    exports: [ConsoleService],
})
export class LoggerModule {}
