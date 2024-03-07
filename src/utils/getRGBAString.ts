import { TColor } from "../constants";

export const getRGBAString = (color: TColor, alpha: number = 255) =>
  `rgb(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
