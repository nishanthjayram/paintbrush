import { useReducer } from "react";
import styles from "./App.module.css";
import { Pixmap } from "./Pixmap";
import PixmapCanvas from "./components/PixmapCanvas/PixmapCanvas";
import { TState } from "./types";
import { stateReducer } from "./utils/stateReducer";

const initializeState = (): TState => ({
  pixmap: new Pixmap(640, 442),
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
          pixmap={state.pixmap}
          onMouseDown={(e) => {
            dispatch({
              type: "mousedown",
              payload: [e.nativeEvent.offsetX, e.nativeEvent.offsetY],
            });
          }}
          onMouseUp={() => {
            dispatch({ type: "mouseup" });
          }}
          onMouseMove={(e) => {
            dispatch({
              type: "mousemove",
              payload: [e.nativeEvent.offsetX, e.nativeEvent.offsetY],
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
          Pen
        </button>
      </div>
    </div>
  );
}

export default App;
