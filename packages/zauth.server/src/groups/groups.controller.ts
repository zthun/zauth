import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { IZGroup, ZGroupBuilder } from '@zthun/auth.core';
import { identity } from 'lodash';
import { Collections } from '../common/collections.enum';
import { ZHttpAssert } from '../common/http-assert.class';
import { identityAsync } from '../common/identity-async.function';
import { IZCrudFlow } from '../crud/crud-flow.interface';
import { ZCrudService } from '../crud/crud.service';

@Controller('groups')
export class ZGroupsController implements IZCrudFlow<IZGroup> {
  public collection: () => string = identity.bind(this, Collections.Groups);
  public sanitize: (item: IZGroup) => Promise<IZGroup> = identityAsync;

  public constructor(private readonly _crud: ZCrudService) { }

  @Get()
  public async list(): Promise<IZGroup[]> {
    return this._crud.list<IZGroup>(this);
  }

  @Get(':_id')
  public async read(@Param() param: { _id: string }): Promise<IZGroup> {
    return this._crud.read(param._id, this);
  }

  @Post()
  public async create(@Body() template: IZGroup): Promise<IZGroup> {
    return this._crud.create(template, this);
  }

  @Put(':_id')
  public async update(@Param() param: { _id: string }, @Body() template: Partial<IZGroup>): Promise<IZGroup> {
    return this._crud.update(param._id, template, this);
  }

  @Delete(':_id')
  public remove(@Param() param: { _id: string }): Promise<IZGroup> {
    return this._crud.remove(param._id, this);
  }

  public async validateCreate(template: IZGroup): Promise<IZGroup> {
    const create = new ZGroupBuilder().copy(template).id(null).build();
    ZHttpAssert.assertNotBlank(create.name, () => new BadRequestException('Group name is required.'));
    return create;
  }

  public async validateUpdate(original: IZGroup, template: Partial<IZGroup>): Promise<IZGroup> {
    const update = new ZGroupBuilder().copy(original).assign(template).id(original._id).build();
    ZHttpAssert.assertNotBlank(update.name, () => new BadRequestException('Group name is required.'));
    return update;
  }

  public async validateRemove(pending: IZGroup): Promise<void> {
    ZHttpAssert.assert(!pending.system, () => new BadRequestException('You cannot delete a system group.'));
  }
}
