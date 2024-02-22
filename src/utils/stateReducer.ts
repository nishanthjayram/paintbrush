import { TState, TStateAction } from "../types";

export const stateReducer = (state: TState, action: TStateAction): TState => {
  switch (action.type) {
    case "mousedown":
      return {
        ...state,
        isDrawing: true,
        lastPos: action.payload,
      };
    case "mousemove":
      if (!state.isDrawing || !state.lastPos) return state;
      switch (state.tool) {
        case "pen":
          return {
            ...state,
            pixmap: state.pixmap
              .copy()
              .drawLine(...state.lastPos, ...action.payload),
            lastPos: action.payload,
          };
        default:
          return state;
      }
    case "mouseup":
      return {
        ...state,
        isDrawing: false,
        lastPos: null,
      };
    case "setTool":
      return {
        ...state,
        tool: action.payload,
      };
    default:
      return state;
  }
};
