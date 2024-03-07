import classnames from "classnames";
import styles from "./Tool.module.css";
import { TTool } from "../../../constants";
import { TReducerState } from "../../../types";

type TProps = TReducerState & {
  tool: TTool;
};
const Tool = ({ tool, state, dispatch }: TProps) => {
  return (
    <button
      className={classnames(state.tool === tool && styles.active, styles.tool)}
      onClick={() => {
        dispatch({ type: "setTool", payload: tool });
      }}
    >
      {tool[0].toUpperCase()}
    </button>
  );
};

export default Tool;
