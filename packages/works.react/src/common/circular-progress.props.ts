/**
 * Represents properties for the circular progress component.
 */
export interface IZCircularProgressProps {
  /**
   * Optional class name.
   *
   * @default ''
   */
  className: string;

  /**
   * An html size string that represents the size.
   *
   * @example 2em
   *
   * @default '1em';
   */
  size: string;

  /**
   * The spinner color.
   *
   * @default 'inherit'
   */
  color: 'primary' | 'secondary' | 'inherit';

  /**
   * True to show the spinner, false to hide it.
   *
   * @default true
   */
  show: boolean;
}
