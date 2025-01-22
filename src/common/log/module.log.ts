import { Module } from '@nestjs/common';
import { ConsoleService } from './service.log';

@Module({
    providers: [ConsoleService],
    exports: [ConsoleService]
})
export class LoggerModule {}
