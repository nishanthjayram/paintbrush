import { TReducerState } from "../../../types";
import { getRGBAString } from "../../../utils/getRGBAString";
import styles from "./Color.module.css";

type TProps = TReducerState & {
  color: number;
};
const Color = ({ state, dispatch, color }: TProps) => {
  return (
    <div
      className={styles.color}
      style={{
        backgroundColor: getRGBAString(state.palette[color]),
      }}
      onContextMenu={(evt) => {
        evt.preventDefault();
        dispatch({ type: "setBorderColor", payload: color });
      }}
      onClick={() => {
        dispatch({ type: "setFillColor", payload: color });
      }}
    />
  );
};

export default Color;
