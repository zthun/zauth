import { IZTypedocEntity } from '@zthun/works.core';
import { ReactNode } from 'react';

/**
 * Represents properties for the ZTypedocTypeParameters component.
 */
export interface IZTypedocTypeParametersViewerProps {
  /**
   * The collection of entities that represent the types.
   *
   * If this is falsy or empty, then nothing is rendered.
   */
  types: IZTypedocEntity[];

  /**
   * The prefix to the type parameter list.
   *
   * @default <
   */
  prefix: ReactNode;

  /**
   * The suffix to the type parameter list.
   *
   * @default >
   */
  suffix: ReactNode;

  /**
   * The separator between the type parameters.
   *
   * @default ,
   */
  separator: string;

  /**
   * Occurs when a child entity is clicked.
   */
  onEntity(id: number): void;
}