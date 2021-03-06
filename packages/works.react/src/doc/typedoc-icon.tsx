import Brightness1Icon from '@material-ui/icons/Brightness1';
import BuildIcon from '@material-ui/icons/Build';
import ClassIcon from '@material-ui/icons/Class';
import CloseIcon from '@material-ui/icons/Close';
import FunctionsIcon from '@material-ui/icons/Functions';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import NoteIcon from '@material-ui/icons/Note';
import TocIcon from '@material-ui/icons/Toc';
import WidgetsIcon from '@material-ui/icons/Widgets';
import { ZTypedocKind } from '@zthun/works.core';
import React from 'react';
import { IZTypedocIconProps } from './typedoc-icon.props';
import CodeIcon from '@material-ui/icons/Code';

/**
 * Represents a view that maps an icon for a typedoc entity type.
 *
 * @param props The properties for this icon component.
 *
 * @returns The jsx for the icon.
 */
export function ZTypedocIcon(props: IZTypedocIconProps) {
  const className = `ZTypedocIcon-root ZTypedocIcon-${props.size}`;

  switch (props.kind) {
    case ZTypedocKind.Enum:
      return <TocIcon className={`${className} ZTypedocIcon-enumeration`} data-testid='ZTypedocIcon-enum' />;
    case ZTypedocKind.Class:
      return <ClassIcon className={`${className} ZTypedocIcon-class`} data-testid='ZTypedocIcon-class' />;
    case ZTypedocKind.Constructor:
      return <BuildIcon className={`${className} ZTypedocIcon-constructor`} data-testid='ZTypedocIcon-constructor' />;
    case ZTypedocKind.Interface:
      return <NoteIcon className={`${className} ZTypedocIcon-interface`} data-testid='ZTypedocIcon-interface' />;
    case ZTypedocKind.TypeAlias:
      return <MergeTypeIcon className={`${className} ZTypedocIcon-type-alias`} data-testid='ZTypedocIcon-type-alias' />;
    case ZTypedocKind.Property:
      return <WidgetsIcon className={`${className} ZTypedocIcon-property`} data-testid='ZTypedocIcon-property' />;
    case ZTypedocKind.Accessor:
      return <LockOpenIcon className={`${className} ZTypedocIcon-accessor`} data-testid='ZTypedocIcon-accessor' />;
    case ZTypedocKind.Variable:
      return <CloseIcon className={`${className} ZTypedocIcon-variable`} data-testid='ZTypedocIcon-variable' />;
    case ZTypedocKind.Namespace:
      return <CodeIcon className={`${className} ZTypedocIcon-namespace`} data-testid='ZTypedocIcon-namespace' />;
    case ZTypedocKind.Function:
    case ZTypedocKind.Method:
      return <FunctionsIcon className={`${className} ZTypedocIcon-function`} data-testid='ZTypedocIcon-function' />;
    default:
      return <Brightness1Icon className={`${className} ZTypedocIcon-bullet`} data-testid='ZTypedocIcon-bullet' />;
  }
}

ZTypedocIcon.defaultProps = {
  size: 'auto'
};
