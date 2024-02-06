import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  async (data: never, context: ExecutionContext) => {
    console.log('====== I enetered the decorator ========');
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
