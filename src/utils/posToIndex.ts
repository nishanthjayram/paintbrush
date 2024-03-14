import { TPos } from "../types";

const posToIndex = (pos: TPos, width: number) => pos[1] * width + pos[0];
