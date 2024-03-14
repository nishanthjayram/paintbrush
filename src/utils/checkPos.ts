import { TPos } from "../types";

export const checkPos = ([x, y]: TPos, width: number, height: number) =>
  x >= 0 && x < width && y >= 0 && y < height;
