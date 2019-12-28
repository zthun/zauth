import { BadRequestException } from '@nestjs/common';
import { IZGroup, ZGroupBuilder } from '@zthun/auth.core';
import { createSpyObj } from 'jest-createspyobj';
import { v4 } from 'uuid';
import { ZCrudService } from '../crud/crud.service';
import { ZGroupsController } from './groups.controller';

describe('ZGroupsController', () => {
  let group: IZGroup;
  let crud: jest.Mocked<ZCrudService>;

  function createTestTarget() {
    return new ZGroupsController(crud);
  }

  beforeEach(() => {
    group = new ZGroupBuilder().id(v4()).name('dc').build();

    crud = createSpyObj(ZCrudService, ['list', 'read', 'create', 'update', 'remove']);
    crud.list.mockReturnValue(Promise.resolve([group]));
    crud.read.mockReturnValue(Promise.resolve(group));
    crud.create.mockReturnValue(Promise.resolve(group));
    crud.update.mockReturnValue(Promise.resolve(group));
    crud.remove.mockReturnValue(Promise.resolve(group));
  });

  describe('List', () => {
    it('returns the items from the crud service.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = await target.list();
      // Assert
      expect(actual).toEqual([group]);
    });
  });

  describe('Create', () => {
    it('creates the items from the crud service.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = await target.create(group);
      // Assert
      expect(actual).toEqual(group);
    });
  });

  describe('Read', () => {
    it('reads an item from the crud service.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = await target.read({ _id: group._id });
      // Assert
      expect(actual).toEqual(group);
    });
  });

  describe('Update', () => {
    it('updates an item from the crud service.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = await target.update({ _id: group._id }, group);
      // Assert
      expect(actual).toEqual(group);
    });
  });

  describe('Delete', () => {
    it('deletes the item from the crud service.', async () => {
      // Arrange
      const target = createTestTarget();
      // Act
      const actual = await target.remove({ _id: group._id });
      // Assert
      expect(actual).toEqual(group);
    });
  });

  describe('Validation', () => {
    describe('Create', () => {
      it('returns the item without an id on valid groups.', async () => {
        // Arrange
        const target = createTestTarget();
        const expected = new ZGroupBuilder().copy(group).id(null).build();
        // Act
        const actual = await target.validateCreate(group);
        // Assert
        expect(actual).toEqual(expected);
      });
    });

    describe('Update', () => {
      it('returns the item with the updated properties on valid groups.', async () => {
        // Arrange
        const target = createTestTarget();
        const name = 'DC Universe';
        const expected = new ZGroupBuilder().copy(group).name(name).build();
        // Act
        const actual = await target.validateUpdate(group, { name });
        // Assert
        expect(actual).toEqual(expected);
      });
    });
  });
});
