import { range } from "./common.js";

/**
 * Grid of values bound by 2 points at opposite corners
 * called start and end, so that [start, end)
 *
 * @typedef { [number, number] } Point
 */
export default class Grid {
  /**
   * @param { Point } start
   * @param { Point } end
   * @param { number[] } values
   * @param { number } valueInit
   */
  constructor(start = [0, 0], end, values = null, valueInit = 1) {
    /**
     * @readonly
     * @type { Point }
     */
    this.start = start;

    /**
     * @readonly
     * @type { Point }
     */
    this.end = end;

    const lengthTotal = this.lengthAlong(0) * this.lengthAlong(1);

    /**
     * @readonly
     * @type { number[] }
     */
    this.values = undefined;

    if (values !== null) {
      if (values.length !== lengthTotal) {
        throw new Error("values has invalid length");
      }

      this.values = values.slice();
    } else {
      this.values = Array.from({ length: lengthTotal })
                         .fill(valueInit);
    }
  }

  /**
   * @param { number } axis
   * @returns { number }
   */
  lengthAlong(axis) {
    return this.end[axis] - this.start[axis];
  }

  /**
   * Convert from flat index used for this.values to
   * vertical and horizontal indices that would be used if
   * this.start === [0, 0]
   *
   * @param { number } idx
   * @returns { Point }
   */
  toVh(idx) {
    const dv = Math.floor(idx / this.lengthAlong(1));
    const dh = idx % this.lengthAlong(1);
    return [this.start[0] + dv, this.start[1] + dh];
  }

  /**
   * Convert from vertical and horizontal indices
   * used for outer grid to flat index used for this.values
   *
   * @private
   * @param { Point } vhOuter
   * @returns { number }
   */
  fromVh(vhOuter) {
    const vhInner = [
      vhOuter[0] - this.start[0],
      vhOuter[1] - this.start[1]
    ];

    return vhInner[0] * this.lengthAlong(1) + vhInner[1];
  }

  /**
   * @private
   * @param { Point[] } vhesOuter
   * @returns { number[] }
   */
  fromVhes(vhesOuter) {
    return vhesOuter.map((vhOuter) => this.fromVh(vhOuter));
  }
    
  /**
   * @param { Point[] } vhesOuter
   * @returns { number[] }
   */
  valuesAt(vhesOuter) {
    const idxesInner = this.fromVhes(vhesOuter);

    return this.values.filter((_,idx) => idxesInner.includes(idx));
  }

  /**
   * @param { (val: number) => number } func
   * @param { Point[] } vhesOuter
   * @returns { Grid }
   */
  applyAt(func, vhesOuter) {
    const idxesInner = this.fromVhes(vhesOuter);

    return new Grid(this.start, this.end,
      this.values.map((val, idx) => {
        if (idxesInner.includes(idx)) {
          return func(val);
        }
        return val;
      })
    );
  }

  /**
   * @param { Point } start
   * @param { Point } end
   * @returns { Grid }
   */
  slice(start, end) {
    let valuesSlice = [];

    range(start[0], end[0]).forEach((v) => {
      valuesSlice = valuesSlice.concat(this.values.slice(
        this.fromVh([v, start[1]]),
        this.fromVh([v, end[1]])
      ))
    });

    return new Grid(start, end, valuesSlice);
  }
}