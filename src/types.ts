import { Pixmap } from "./Pixmap";
import { PALETTE } from "./constants";

export type TPalette = typeof PALETTE;

export type TLayers = {
  main: Pixmap;
  preview: Pixmap;
};

export type TPos = [number, number];

export type TTool = "pen" | "line";

export type TState = {
  layers: TLayers;
  isDrawing: boolean;
  lastPos: TPos | null;
  tool: TTool;
};

export type TStateAction =
  | {
      type: "mousedown";
      startPos: TPos;
      lastPos: TPos;
    }
  | { type: "mousemove"; lastPos: TPos }
  | { type: "mouseup" }
  | { type: "setTool"; payload: TTool };
