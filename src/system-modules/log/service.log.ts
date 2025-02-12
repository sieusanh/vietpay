import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';
import { ILogInfo } from './constant.log';

// @Injectable()
// export class LogService implements LoggerService {
//     log(message: any, ...optionalParams: any[]) {
//     }

//     error(message: any, ...optionalParams: any[]) {
//     }

//     warn(message: any, ...optionalParams: any[]) {
//     }
// }

@Injectable({ scope: Scope.TRANSIENT })
export class ConsoleService extends ConsoleLogger {
    protected context: string;

    log(message: any, context?: string) {
        super.log(message, context);
    }

    printLog(info: ILogInfo) {
        let message = `[${info.title}] `;
        for (const [key, val] of Object.entries(info.data)) {
            message += `[${key}: ${val}] `;
        }
        super.log(message, this.context);
    }

    //   error(message: any, stack?: string, context?: string) {
    //     // add your tailored logic here
    //     // super.error(...arguments);
    //     // super.error(context);
    //     super.error(message, stack, context);
    //   }

    //   customLog() {
    //     this.log('Please feed the cat!');
    //   }
}
