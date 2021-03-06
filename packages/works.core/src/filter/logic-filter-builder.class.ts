import { IZFilter } from './filter.type';
import { IZLogicFilter } from './logic-filter.interface';
import { ZLogicOperator } from './logic-operator.enum';

/**
 * Represents a builder for a logic filter.
 */
export class ZLogicFilterBuilder {
  private _filter: IZLogicFilter;

  /**
   * Initializes a new instance of this object.
   */
  public constructor() {
    this._filter = {
      clauses: [],
      operator: ZLogicOperator.And
    };
  }

  /**
   * Sets the operator to and.
   *
   * @returns This object.
   */
  public and(): this {
    this._filter.operator = ZLogicOperator.And;
    return this;
  }

  /**
   * Sets the operator to or.
   *
   * @returns This object.
   */
  public or(): this {
    this._filter.operator = ZLogicOperator.Or;
    return this;
  }

  /**
   * Adds another clause.
   *
   * @param val The clause to add.
   *
   * @returns This object.
   */
  public clause(val: IZFilter): this {
    this._filter.clauses.push(val);
    return this;
  }

  /**
   * Sets the list of clauses.
   *
   * @param val the value to set.
   *
   * @returns This object
   */
  public clauses(val: IZFilter[]): this {
    this._filter.clauses = val;
    return this;
  }

  /**
   * Returns the filter.
   *
   * @returns The logic filter
   */
  public build(): IZLogicFilter {
    return { ...this._filter };
  }
}
