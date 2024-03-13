import { TState, TStateAction } from "../types";
import { getMidpoint } from "./getMidpoint";

export const stateReducer = (state: TState, action: TStateAction): TState => {
  switch (action.type) {
    case "mousedown":
      return {
        ...state,
        isDrawing: true,
        lastPos: action.lastPos,
      };
    case "mousemove":
      if (!state.isDrawing || !state.lastPos) return state;
      switch (state.tool) {
        case "pen":
          return {
            ...state,
            layers: {
              ...state.layers,
              main: state.layers.main
                .copy()
                .drawLine(...state.lastPos, ...action.lastPos, state.fillColor),
            },
            lastPos: action.lastPos,
          };
        case "line":
          return {
            ...state,
            layers: {
              ...state.layers,
              preview: state.layers.preview
                .copy()
                .clear()
                .drawLine(...state.lastPos, ...action.lastPos, state.fillColor),
            },
          };
        case "rectangle": {
          return {
            ...state,
            layers: {
              ...state.layers,
              preview: state.layers.preview
                .copy()
                .clear()
                .drawRectangle(
                  ...state.lastPos,
                  ...action.lastPos,
                  state.fillColor
                ),
            },
          };
        }
        case "filledRectangle":
          return {
            ...state,
            layers: {
              ...state.layers,
              preview: state.layers.preview
                .copy()
                .clear()
                .drawFilledRectangle(
                  ...state.lastPos,
                  ...action.lastPos,
                  state.fillColor,
                  state.borderColor
                ),
            },
          };
        case "ellipse":
          return {
            ...state,
            layers: {
              ...state.layers,
              preview: state.layers.preview
                .copy()
                .clear()
                .drawEllipse(
                  ...getMidpoint(state.lastPos, action.lastPos),
                  Math.floor(
                    Math.abs(action.lastPos[0] - state.lastPos[0]) / 2
                  ),
                  Math.floor(
                    Math.abs(action.lastPos[1] - state.lastPos[1]) / 2
                  ),
                  state.fillColor
                ),
            },
          };
        default:
          return state;
      }
    case "mouseup":
      return {
        ...state,
        isDrawing: false,
        lastPos: null,
        layers: {
          ...state.layers,
          main: state.layers.main.copy().combinePixels(state.layers.preview),
          preview: state.layers.preview.copy().clear(),
        },
      };
    case "setTool":
      return {
        ...state,
        tool: action.payload,
      };
    case "setPalette":
      return {
        ...state,
        palette: action.payload,
      };
    case "setFillColor":
      return {
        ...state,
        fillColor: action.payload,
      };
    case "setBorderColor":
      return {
        ...state,
        borderColor: action.payload,
      };
    default:
      return state;
  }
};
