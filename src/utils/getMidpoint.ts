import { TPos } from "../types";

export const getMidpoint = ([x0, y0]: TPos, [x1, y1]: TPos): TPos => [
  Math.floor((x0 + x1) / 2),
  Math.floor((y0 + y1) / 2),
];
