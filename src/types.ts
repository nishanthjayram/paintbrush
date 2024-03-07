import { Pixmap } from "./Pixmap";
import { TPalette, TTool } from "./constants";

export type TLayers = {
  main: Pixmap;
  preview: Pixmap;
};

export type TPos = [number, number];

export type TState = {
  layers: TLayers;
  isDrawing: boolean;
  lastPos: TPos | null;
  tool: TTool;
  palette: TPalette;
  fillColor: number;
  borderColor: number;
};

export type TStateAction =
  | {
      type: "mousedown";
      startPos: TPos;
      lastPos: TPos;
    }
  | { type: "mousemove"; lastPos: TPos }
  | { type: "mouseup" }
  | { type: "setTool"; payload: TTool }
  | { type: "setPalette"; payload: TPalette }
  | { type: "setFillColor"; payload: number }
  | { type: "setBorderColor"; payload: number };

export type TReducerState = {
  state: TState;
  dispatch: React.Dispatch<TStateAction>;
};
