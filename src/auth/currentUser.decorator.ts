import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    // console.log('this is ctx: ', ctx);
    return ctx.getContext().req.user;
  },
);

// Test to get user Context from https://github.com/nestjs/graphql/issues/48#issuecomment-420693225
// export const User = createParamDecorator(
//   (data, [root, args, ctx, info]) => ctx.req.user,
// );

// Test to get user Context from https://github.com/nestjs/graphql/issues/48#issuecomment-420693225
