import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'common/decorator';

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) { }   

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> {
        // const roles = this.reflector.get(Roles, context.getHandler());
        // const roles = this.reflector.get(Roles, context.getClass());
        // const roles = this.reflector.getAllAndOverride(Roles, [context.getHandler(), context.getClass()]);
        // const roles = this.reflector.getAllAndMerge(Roles, [context.getHandler(), context.getClass()]);
        const roles = this.reflector.getAllAndMerge('roles', [context.getHandler(), context.getClass()]);
        
        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // return matchRoles(roles, user.roles);

    }
}

function matchRoles(roles: string[], userRoles: string[]) {
    const roleSet = new Set(roles);
    const userRoleSet = new Set(userRoles);
    const hasCommonRole = [...userRoleSet].some(item => roleSet.has(item));
    return hasCommonRole;
}
