import { getNextPlayer } from "../../random-placements.js";

/** Length from start to end inclusive */
export function len(start: number, end: number): number {
  return end - start + 1;
}

/** List from start to end inclusive, with step size 1 */
export function range(start: number, end: number): number[] {
  return Array.from(Array(len(start, end)).keys()).map(val => val + start);
}

/** List of numbers to list of cumulative sums */
function cumul(nums: number[]): number[] {
  let res = Array(nums.length);
  nums.reduce((acc, val, idx) => res[idx] = acc + val, 0);
  return res;
}

/** Random index, using relative weights */
export function pickIndex(weights: number[]): number {
  console.assert(Math.min(...weights) >= 0, 'negative weight');
  console.assert(Math.max(...weights) > 0, 'weights all zero');
  const total = weights.reduce((acc, val) => acc + val, 0);
  const nRand = Math.floor(Math.random() * total);
  return cumul(weights).findIndex(val => {  // first one found
    return val > nRand;
  });
}

/** [vert, horz] -> idx */
export function fromVhMaker(lenRow: number) {
  return function([v, h]: [number, number]): number {
    return v*lenRow + h;
  }
}

/** idx -> [vert, horz] */
export function toVhMaker(lenRow: number) {
  return function(idx: number): [number, number] {
    const v = Math.floor(idx / lenRow);
    const h = idx % lenRow;
    return [v, h];
  }
}

/** Whether point is within rectangle spanned by [0, 0] and 2 lengths,
*   upper bounds excluded*/
export function isInGrid(lens: [number, number], point: [number, number]): boolean {
  return point[0] >= 0 &&
         point[0] < lens[0] &&
         point[1] >= 0 &&
         point[1] < lens[1];
}

/** Assign each stone to either player */
export function assignPlayers(stones: [number, number][], handicap: number) {
  let placements = [];
  stones.forEach(stn => {
    const player = getNextPlayer(placements, handicap);
    const [col, row] = stn;  // directly stn[0], stn[1] in obj literal gave error
    placements.push({col, row, player});
  });
  return placements;
}
