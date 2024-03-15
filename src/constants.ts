export type TColor = (typeof WINDOWS_PALETTE)[number];
export type TTool = (typeof TOOLS)[number];
export type TPalette = [emptyColor: TColor, ...TColor[]];

export const WINDOWS_PALETTE = [
  [0, 0, 0], // Black
  [0, 0, 170], // Dark Blue
  [0, 0, 255], // Blue
  [0, 170, 85], // Dark Cyan
  [0, 255, 0], // Green
  [0, 255, 255], // Cyan
  [85, 170, 170], // Teal
  [134, 138, 142], // Grey
  [170, 0, 85], // Dark Magenta
  [170, 85, 170], // Purple
  [170, 170, 85], // Olive
  [195, 199, 203], // Light Grey
  [255, 0, 0], // Red
  [255, 0, 255], // Magenta
  [255, 255, 0], // Yellow
  [255, 255, 255], // White
] as const;

export const TOOLS = [
  "colorEraser",
  "eraser",
  "fill",
  "pen",
  "line",
  "rectangle",
  "filledRectangle",
  "ellipse",
];

export const COLOR_PALETTE: TPalette = [
  [255, 255, 255], // Empty
  [255, 255, 255], // White
  [195, 199, 203], // Light Grey
  [255, 0, 0], // Red
  [255, 255, 0], // Yellow
  [0, 255, 0], // Green
  [0, 255, 255], // Cyan
  [0, 0, 255], // Blue
  [255, 0, 255], // Magenta
  [255, 255, 255], // TBD
  [255, 255, 255], // TBD
  [255, 255, 255], // TBD
  [255, 255, 255], // TBD
  [255, 255, 255], // TBD
  [255, 255, 255], // TBD
  [0, 0, 0], // Black
  [134, 138, 142], // Grey
  [170, 0, 85], // Dark Magenta
  [170, 170, 85], // Olive
  [0, 170, 85], // Dark Cyan
  [85, 170, 170], // Teal
  [0, 0, 170], // Dark Blue
  [170, 85, 170], // Purple
  [255, 255, 255], // TBD
  [255, 255, 255], // TBD
  [255, 255, 255], // TBD
  [255, 255, 255], // TBD
  [255, 255, 255], // TBD
  [255, 255, 255], // TBD
];
