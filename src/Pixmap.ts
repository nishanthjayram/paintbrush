import { BitSet } from "./classes/BitSet";
import { TPos } from "./types";
import { getEllipse, getLine, getRoundedRect } from "./utils/shapes";
export class Pixmap {
  readonly pixels: Uint8ClampedArray;
  readonly width: number;
  readonly height: number;
  private readonly stride: number;
  private readonly visited: BitSet;

  constructor(width: number, height: number, backgroundColor: number = 0) {
    this.width = width;
    this.height = height;
    this.stride = width;
    this.pixels = new Uint8ClampedArray(width * height).fill(backgroundColor);
    this.visited = new BitSet(width * height);
  }

  /**
   * Converts a position [x, y] to an index in the Pixmap's pixel array.
   * @param param0 The position [x, y] to convert.
   * @returns The index of the position in the pixel array.
   */
  private posToIndex([x, y]: TPos): number {
    return y * this.stride + x;
  }

  /**
   * Checks if a given position is within the bounds of the Pixmap.
   * @param param0 The position [x, y] to check.
   * @returns True if the position is within the bounds of the Pixmap.
   */
  private checkPos([x, y]: TPos): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  /**
   * Sets the color of a pixel at a given position.
   * @param pos The position [x, y] to set the pixel color.
   * @param color The color to set the pixel to.
   */
  private setPixel(pos: TPos, color: number) {
    this.pixels[this.posToIndex(pos)] = color;
  }

  /**
   * Gets the color of a pixel at a given position.
   * @param pos The position [x, y] to get the pixel color from.
   * @returns The color of the pixel at the given position.
   */
  getPixel(pos: TPos) {
    const [x, y] = pos;
    if (this.checkPos([x, y])) {
      return this.pixels[this.posToIndex([x, y])];
    }
    return 0;
  }

  /**
   * Draws a line between two points.
   * @param param0 The starting position [x0, y0].
   * @param param1 The ending position [x1, y1].
   * @param color The color of the line.
   * @returns The original Pixmap with the line drawn.
   */
  drawLine([x0, y0]: TPos, [x1, y1]: TPos, color: number): this {
    for (const pos of getLine([x0, y0], [x1, y1])) {
      if (!this.checkPos(pos)) continue;
      const index = this.posToIndex(pos);
      if (!this.visited.check(index)) {
        this.setPixel(pos, color);
        this.visited.set(index);
      }
    }
    return this;
  }

  /**
   * Erases a line between two points.
   * @param param0 The starting position [x0, y0].
   * @param param1 The ending position [x1, y1].
   * @param color The color to erase. If not provided, erases all colors.
   * @returns The original Pixmap with the line erased.
   */
  erase([x0, y0]: TPos, [x1, y1]: TPos, color?: number): this {
    for (const pos of getLine([x0, y0], [x1, y1])) {
      if (color === undefined || this.getPixel(pos) === color) {
        this.setPixel(pos, 0);
      }
    }
    return this;
  }

  /**
   * Draws a rectangle with a border.
   * @param param0 The starting position [x0, y0].
   * @param param1 The ending position [x1, y1].
   * @param borderColor The color of the rectangle border.
   * @returns The original Pixmap with the rectangle.
   */
  drawRectangle([x0, y0]: TPos, [x1, y1]: TPos, borderColor: number): this {
    return this.drawLine([x0, y0], [x1, y0], borderColor)
      .drawLine([x1, y0], [x1, y1], borderColor)
      .drawLine([x1, y1], [x0, y1], borderColor)
      .drawLine([x0, y1], [x0, y0], borderColor);
  }

  /**
   * Draws a filled rectangle with a border.
   * @param param0 The starting position [x0, y0].
   * @param param1 The ending position [x1, y1].
   * @param fillColor The color to fill the rectangle with.
   * @param borderColor The color of the rectangle border.
   * @returns The original Pixmap with the filled rectangle.
   */
  drawFilledRectangle(
    [x0, y0]: TPos,
    [x1, y1]: TPos,
    fillColor: number,
    borderColor: number
  ): this {
    const [xMin, xMax] = x0 < x1 ? [x0, x1] : [x1, x0];
    const [yMin, yMax] = y0 < y1 ? [y0, y1] : [y1, y0];

    this.drawRectangle([xMin, yMin], [xMax, yMax], borderColor);

    for (let y = yMin + 1; y < yMax; y++) {
      const startIndex = this.posToIndex([xMin + 1, y]);
      const endIndex = this.posToIndex([xMax, y]);
      this.pixels.fill(fillColor, startIndex, endIndex);
    }
    return this;
  }

  /**
   * Draws an ellipse with a border.
   * @param param0 The starting position [x0, y0].
   * @param param1 The radii [rx, ry].
   * @param borderColor The color of the ellipse border.
   * @returns The original Pixmap with the ellipse.
   */
  drawEllipse([x0, y0]: TPos, [rx, ry]: TPos, borderColor: number) {
    for (const pos of getEllipse([x0, y0], rx, ry)) {
      if (!this.checkPos(pos)) continue;
      const index = this.posToIndex(pos);
      if (!this.visited.check(index)) {
        this.setPixel(pos, borderColor);
        this.visited.set(index);
      }
    }
    return this;
  }

  /**
   * Draws an ellipse filled with a new color.
   * @param param0 The starting position [x0, y0].
   * @param param1 The radii [rx, ry].
   * @param fillColor The color to fill the ellipse with.
   * @param borderColor The color of the ellipse border.
   * @returns The original Pixmap with the filled ellipse.
   */
  drawFilledEllipse(
    [x0, y0]: TPos,
    [rx, ry]: TPos,
    fillColor: number,
    borderColor: number
  ) {
    this.drawEllipse([x0, y0], [rx, ry], borderColor);
    for (let y = -ry; y <= ry; y++) {
      const x = Math.round(rx * Math.sqrt(1 - (y * y) / (ry * ry)));
      for (let i = x0 - x; i <= x0 + x; i++) {
        const pos: TPos = [i, y0 + y];
        if (this.getPixel(pos) !== borderColor) this.setPixel(pos, fillColor);
      }
    }

    return this;
  }

  /**
   * Draws a rounded rectangle.
   * @param start The top-left position [x0, y0].
   * @param end The bottom-right position [x1, y1].
   * @param radius The corner radius.
   * @param borderColor The color of the rectangle border.
   * @param thickness The thickness of the stroke.
   * @returns The original Pixmap with the rounded rectangle.
   */
  drawRoundedRectangle(
    start: TPos,
    end: TPos,
    radius: number,
    borderColor: number,
    thickness: number = 1
  ): this {
    for (const pos of getRoundedRect(start, end, radius, thickness)) {
      if (!this.checkPos(pos)) continue;
      const index = this.posToIndex(pos);
      if (!this.visited.check(index)) {
        this.setPixel(pos, borderColor);
        this.visited.set(index);
      }
    }
    return this;
  }

  /**
   * Draws a filled rounded rectangle.
   * @param start The top-left position [x0, y0]
   * @param end The bottom-right position [x1, y1]
   * @param radius The corner radius
   * @param fillColor The color to fill the rectangle with
   * @param borderColor The color of the rectangle border
   * @returns The original Pixmap with the filled rounded rectangle
   */
  drawFilledRoundedRectangle(
    start: TPos,
    end: TPos,
    radius: number,
    fillColor: number,
    borderColor: number
  ): this {
    const [x0, y0] = start;
    const [x1, y1] = end;
    const [xMin, xMax] = x0 < x1 ? [x0, x1] : [x1, x0];
    const [yMin, yMax] = y0 < y1 ? [y0, y1] : [y1, y0];

    // Adjust radius if too large
    const maxRadius = Math.min((xMax - xMin) / 2, (yMax - yMin) / 2);
    radius = Math.min(radius, maxRadius);

    // Draw border
    this.drawRoundedRectangle(start, end, radius, borderColor);

    // Fill interior
    for (let y = yMin + 1; y < yMax; y++) {
      let xStart = xMin + 1;
      let xEnd = xMax - 1;

      // Adjust start/end for rounded corners
      if (y < yMin + radius) {
        const dy = radius - (y - yMin);
        const dx = Math.floor(Math.sqrt(radius * radius - dy * dy));
        xStart += radius - dx;
        xEnd -= radius - dx;
      } else if (y > yMax - radius) {
        const dy = radius - (yMax - y);
        const dx = Math.floor(Math.sqrt(radius * radius - dy * dy));
        xStart += radius - dx;
        xEnd -= radius - dx;
      }

      // Fill row
      for (let x = xStart; x <= xEnd; x++) {
        const pos: TPos = [x, y];
        if (this.getPixel(pos) !== borderColor) {
          this.setPixel(pos, fillColor);
        }
      }
    }

    return this;
  }

  /**
   * Fills a contiguous area of the Pixmap with a new color.
   * @param start The starting position [x0, y0].
   * @param fillColor The color to fill the area with.
   * @returns The original Pixmap with the filled area.
   */
  fill(start: TPos, fillColor: number) {
    const targetColor = this.getPixel(start);
    if (fillColor === targetColor) return this;

    const queue: TPos[] = [start];
    while (queue.length > 0) {
      const pos = queue.shift();
      if (!pos) continue;

      const [x, y] = pos;
      const index = this.posToIndex([x, y]);

      if (
        !this.checkPos([x, y]) ||
        this.getPixel([x, y]) !== targetColor ||
        this.visited.check(index)
      ) {
        continue;
      }

      this.setPixel([x, y], fillColor);
      this.visited.set(index);

      const neighbors: TPos[] = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
      ];
      neighbors.forEach((p) => {
        const idx = this.posToIndex(p);
        if (!this.visited.check(idx)) {
          queue.push(p);
        }
      });
    }

    return this;
  }

  /**
   * Creates a copy of the Pixmap.
   * @returns A new Pixmap with the same dimensions and pixels.
   */
  copy() {
    const copy = new Pixmap(this.width, this.height);
    copy.pixels.set(this.pixels);
    return copy;
  }

  clear() {
    this.pixels.fill(0);
    return this;
  }

  /**
   * Combines the pixels of the Pixmap with another Pixmap, where non-zero
   * pixels in the overlay Pixmap replace those in the original Pixmap.
   * @param overlay The Pixmap to combine with.
   * @returns The original Pixmap with the overlay combined.
   */
  combinePixels(overlay: Pixmap): this {
    if (overlay.width !== this.width || overlay.height !== this.height) {
      throw new Error("Cannot merge pixmaps of different dimensions.");
    }

    const len = this.pixels.length;
    for (let i = 0; i < len; i++) {
      if (overlay.pixels[i] !== 0) {
        this.pixels[i] = overlay.pixels[i];
      }
    }
    return this;
  }
}
