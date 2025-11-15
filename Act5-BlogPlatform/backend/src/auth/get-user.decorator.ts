import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom parameter decorator to extract authenticated user from request
 * Used in controllers to get the user object attached by JwtAuthGuard
 * @param {unknown} data - Optional data passed to the decorator (unused)
 * @param {ExecutionContext} ctx - Execution context containing the request
 * @returns {User} The authenticated user object from the request
 */
export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});