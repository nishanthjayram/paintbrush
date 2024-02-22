import { Pixmap } from "./Pixmap";
import { PALETTE } from "./constants";

export type TPalette = typeof PALETTE;
export type TColor = keyof TPalette;

export type TPos = [number, number];

export type TTool = "pen";

export type TState = {
  pixmap: Pixmap;
  isDrawing: boolean;
  lastPos: TPos | null;
  tool: TTool;
};

export type TStateAction =
  | {
      type: "mousedown";
      payload: TPos;
    }
  | { type: "mousemove"; payload: TPos }
  | { type: "mouseup" }
  | { type: "setTool"; payload: TTool };
