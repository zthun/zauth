import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ZAssert } from '@zthun/works.core';
import { Request } from 'express';
import { ZTokensService } from '../tokens/tokens.service';

@Injectable()
export class ZRuleCookieRequiresAuth implements CanActivate {
  public constructor(private readonly _jwt: ZTokensService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const user = await this._jwt.extract(request);
    ZAssert.claim(!!user, 'You are not authenticated.  Please log in.').assert((msg) => new UnauthorizedException(msg));
    return true;
  }
}