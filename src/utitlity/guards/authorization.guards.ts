import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<string[]>(
      'allowedRoles',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    const result = request?.currentUser?.roles
      .map((role: string) => allowedRoles.includes(role))
      .find((val: boolean) => val === true);
    if (result) return true;
    throw new ForbiddenException(
      'Sorry you are not allowed to access this resource',
    );
  }
}