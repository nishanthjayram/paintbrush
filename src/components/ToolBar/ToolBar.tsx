import { TTool } from "../../constants";
import { TReducerState } from "../../types";
import Tool from "./Tool/Tool";
import styles from "./ToolBar.module.css";

type TProps = TReducerState & {
  tools: TTool[];
};
const ToolBar = ({ tools, state, dispatch }: TProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        {tools.map((tool) => (
          <Tool key={tool} tool={tool} state={state} dispatch={dispatch} />
        ))}
      </div>
    </div>
  );
};

export default ToolBar;
