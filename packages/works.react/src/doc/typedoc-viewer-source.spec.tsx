/* eslint-disable require-jsdoc */

import { act, fireEvent, render } from '@testing-library/react';
import { IZTypedoc, ZTypedocKind, ZTypedocTypeKind } from '@zthun/works.core';
import Axios from 'axios';
import React from 'react';
import { ZTypedocViewerSource } from './typedoc-viewer-source';

jest.mock('axios');

describe('ZTypedocViewerSource', () => {
  let entityId: number;
  let onAction: jest.Mock;
  let onEntity: jest.Mock;
  let typedoc: IZTypedoc;

  function createTestTarget() {
    return render(<ZTypedocViewerSource src='/path/to/typedoc.json' entityId={entityId} onAction={onAction} onEntity={onEntity} />);
  }

  beforeEach(() => {
    onAction = jest.fn();
    onEntity = jest.fn();

    entityId = null;

    typedoc = {
      name: '@zthun/works.core',
      children: [
        {
          id: 11,
          name: 'ZBinaryOperator',
          kind: ZTypedocKind.Enum
        },
        {
          id: 12,
          name: 'ZSampleClass',
          kind: ZTypedocKind.Class,
          children: [
            {
              id: 158,
              name: 'operator',
              kind: 1024,
              kindString: 'Property',
              flags: {
                isPublic: true
              },
              type: {
                type: ZTypedocTypeKind.Reference,
                id: 11,
                name: 'ZBinaryOperator'
              },
              defaultValue: 'true'
            }
          ],
          groups: [
            {
              title: 'Properties',
              kind: ZTypedocKind.Property,
              children: [158]
            }
          ]
        }
      ],
      groups: [
        {
          title: 'Enumerations',
          kind: ZTypedocKind.Enum,
          children: [11]
        },
        {
          title: 'Classes',
          kind: ZTypedocKind.Class,
          children: [12]
        }
      ]
    };

    (Axios.get as jest.Mock).mockResolvedValue({ data: typedoc });
  });

  afterEach(() => {
    (Axios.get as jest.Mock).mockClear();
  });

  describe('Typedoc', () => {
    it('renders the typedoc not loaded if the request fails.', async () => {
      // Arrange
      let actual: HTMLElement = null;
      (Axios.get as jest.Mock).mockRejectedValue('file not found');
      // Act
      await act(async () => {
        const target = createTestTarget();
        actual = await target.findByTestId('ZTypedocViewer-no-typedoc-loaded');
      });
      // Assert
      expect(actual).toBeTruthy();
    });

    it('renders the globals.', async () => {
      // Arrange
      const expected = `ZTypedocViewer-entity-${typedoc.children[0].id}`;
      let actual: HTMLElement = null;
      // Act
      await act(async () => {
        const target = createTestTarget();
        actual = await target.findByTestId(expected);
      });
      // Assert
      expect(actual).toBeTruthy();
    });

    it('navigates to an entity when the entity is clicked.', async () => {
      // Arrange
      const expected = typedoc.children[0].id;
      // Act
      await act(async () => {
        const target = createTestTarget();
        const btn = await target.findByTestId(`ZTypedocViewer-entity-${expected}`);
        fireEvent.click(btn);
      });
      // Assert
      expect(onEntity).toHaveBeenCalledWith(typedoc.children[0]);
    });
  });

  describe('Entity', () => {
    beforeEach(() => {
      entityId = 12;
    });

    it('renders the entity.', async () => {
      // Arrange
      const expected = 'ZTypedocEntityViewer-root';
      let actual: HTMLElement = null;
      // Act
      await act(async () => {
        const target = createTestTarget();
        actual = await target.findByTestId(expected);
      });
      // Assert
      expect(actual).toBeTruthy();
    });

    it('displays an error if no entity is found.', async () => {
      // Arrange
      entityId = 99999999;
      let actual: HTMLElement = null;
      // Act
      await act(async () => {
        const target = createTestTarget();
        actual = await target.findByTestId('ZTypedocViewer-no-entity-found');
      });
      expect(actual).toBeTruthy();
    });

    it('navigates to the id that was clicked in the entity viewer.', async () => {
      // Arrange
      const expected = 11;
      // Act
      await act(async () => {
        const target = createTestTarget();
        const link = await target.findAllByText('ZBinaryOperator');
        fireEvent.click(link[0]);
      });
      // Assert
      expect(onEntity).toHaveBeenCalledWith(expected);
    });
  });
});
