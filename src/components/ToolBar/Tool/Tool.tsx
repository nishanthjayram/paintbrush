import classnames from "classnames";
import styles from "./Tool.module.css";
import { TTool } from "../../../constants";
import { TReducerState } from "../../../types";

import ColorEraserSVG from "../../../assets/icons/tools/colorEraser.svg?react";
import EraserSVG from "../../../assets/icons/tools/eraser.svg?react";
import FillSVG from "../../../assets/icons/tools/fill.svg?react";
import PenSVG from "../../../assets/icons/tools/pen.svg?react";
import BezierSVG from "../../../assets/icons/tools/bezier.svg?react";
import LineSVG from "../../../assets/icons/tools/line.svg?react";
import RectangleSVG from "../../../assets/icons/tools/rectangle.svg?react";
import FilledRectangleSVG from "../../../assets/icons/tools/filledRectangle.svg?react";
import RoundedRectangleSVG from "../../../assets/icons/tools/roundedRectangle.svg?react";
import FilledRoundedRectangleSVG from "../../../assets/icons/tools/filledRoundedRectangle.svg?react";
import EllipseSVG from "../../../assets/icons/tools/ellipse.svg?react";
import FilledEllipseSVG from "../../../assets/icons/tools/filledEllipse.svg?react";
import PolygonSVG from "../../../assets/icons/tools/polygon.svg?react";
import FilledPolygonSVG from "../../../assets/icons/tools/filledPolygon.svg?react";

const toolToSVGMap: Record<
  TTool,
  React.FunctionComponent<React.SVGProps<SVGSVGElement>>
> = {
  colorEraser: ColorEraserSVG,
  eraser: EraserSVG,
  fill: FillSVG,
  pen: PenSVG,
  bezier: BezierSVG,
  line: LineSVG,
  rectangle: RectangleSVG,
  filledRectangle: FilledRectangleSVG,
  roundedRectangle: RoundedRectangleSVG,
  filledRoundedRectangle: FilledRoundedRectangleSVG,
  ellipse: EllipseSVG,
  filledEllipse: FilledEllipseSVG,
  polygon: PolygonSVG,
  filledPolygon: FilledPolygonSVG,
};

type TProps = TReducerState & {
  tool: TTool;
};
const Tool = ({ tool, state, dispatch }: TProps) => {
  const ToolSVG = toolToSVGMap[tool] ?? RectangleSVG;
  return (
    <ToolSVG
      className={classnames(state.tool === tool && styles.active, styles.tool)}
      onClick={() => {
        console.log(`setting tool to ${tool}`);
        dispatch({ type: "setTool", payload: tool });
      }}
    />
  );
};

export default Tool;
