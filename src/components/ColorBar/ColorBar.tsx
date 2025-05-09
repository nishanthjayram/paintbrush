import { TReducerState } from "../../types";
import { getRGBAString } from "../../utils/getRGBAString";
import Color from "./Color/Color";
import styles from "./ColorBar.module.css";

const ColorBar = ({ state, dispatch }: TReducerState) => {
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.borderColor}
        style={{
          backgroundColor: getRGBAString(state.palette[state.borderColor]),
        }}
      >
        <div
          className={styles.fillColor}
          style={{
            backgroundColor: getRGBAString(state.palette[state.fillColor]),
          }}
        />
      </div>
      <div className={styles.colorbar}>
        {state.palette.slice(1).map((_, index) => (
          <Color
            key={index}
            color={index + 1} // We slice by 1 to skip the "empty" state.
            state={state}
            dispatch={dispatch}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorBar;
