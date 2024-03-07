import { useReducer } from "react";
import styles from "./App.module.css";
import { Pixmap } from "./Pixmap";
import PixmapCanvas from "./components/PixmapCanvas/PixmapCanvas";
import { TState } from "./types";
import { stateReducer } from "./utils/stateReducer";
import ColorBar from "./components/ColorBar/ColorBar";
import { COLOR_PALETTE, TOOLS } from "./constants";
import ToolBar from "./components/ToolBar/ToolBar";

const initializeState = (): TState => ({
  layers: {
    main: new Pixmap(640, 442),
    preview: new Pixmap(640, 442),
  },
  isDrawing: false,
  lastPos: null,
  tool: "pen",
  palette: COLOR_PALETTE,
  fillColor: 15,
  borderColor: 1,
});

function App() {
  const [state, dispatch] = useReducer(stateReducer, initializeState());
  return (
    <div className={styles.app}>
      <div className={styles.middle}>
        <ToolBar tools={TOOLS} state={state} dispatch={dispatch} />
        <div>
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
          <ColorBar state={state} dispatch={dispatch} />
        </div>
      </div>
    </div>
  );
}

export default App;
