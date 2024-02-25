import { useReducer } from "react";
import styles from "./App.module.css";
import { Pixmap } from "./Pixmap";
import PixmapCanvas from "./components/PixmapCanvas/PixmapCanvas";
import { TState } from "./types";
import { stateReducer } from "./utils/stateReducer";

const initializeState = (): TState => ({
  layers: {
    main: new Pixmap(640, 442),
    preview: new Pixmap(640, 442),
  },
  isDrawing: false,
  lastPos: null,
  tool: "pen",
});

function App() {
  const [state, dispatch] = useReducer(stateReducer, initializeState());
  return (
    <div className={styles.app}>
      <div className={styles.canvasWrapper}>
        <PixmapCanvas
          layers={state.layers}
          onMouseDown={(e) => {
            dispatch({
              type: "mousedown",
              startPos: [e.nativeEvent.offsetX, e.nativeEvent.offsetY],
              lastPos: [e.nativeEvent.offsetX, e.nativeEvent.offsetY],
            });
          }}
          onMouseUp={() => {
            dispatch({ type: "mouseup" });
          }}
          onMouseMove={(e) => {
            dispatch({
              type: "mousemove",
              lastPos: [e.nativeEvent.offsetX, e.nativeEvent.offsetY],
            });
          }}
        />
      </div>
      <div>
        <button
          onClick={() => {
            dispatch({ type: "setTool", payload: "pen" });
          }}
        >
          {state.tool === "pen" ? "Pen (selected)" : "Pen"}
        </button>
        <button
          onClick={() => {
            dispatch({ type: "setTool", payload: "line" });
          }}
        >
          {state.tool === "line" ? "Line (selected)" : "Line"}
        </button>
      </div>
    </div>
  );
}

export default App;
