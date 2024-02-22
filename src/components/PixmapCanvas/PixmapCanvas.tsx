import React, { useEffect, useRef } from "react";
import styles from "./PixmapCanvas.module.css";
import { Pixmap } from "../../Pixmap";

type TProps = React.HTMLAttributes<HTMLCanvasElement> & {
  pixmap: Pixmap;
};
const PixmapCanvas = (props: TProps) => {
  const { pixmap, ...rest } = props;

  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");

    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const imageData = ctx.getImageData(0, 0, pixmap.width, pixmap.height).data;

    for (let y = 0; y < pixmap.height; y++) {
      for (let x = 0; x < pixmap.width; x++) {
        const [r, g, b] = pixmap.getPixel(x, y);
        const imageIndex = (y * pixmap.width + x) * 4;
        imageData[imageIndex] = r;
        imageData[imageIndex + 1] = g;
        imageData[imageIndex + 2] = b;
        imageData[imageIndex + 3] = 255;
      }
    }

    ctx.putImageData(
      new ImageData(imageData, pixmap.width, pixmap.height),
      0,
      0
    );
  }, [pixmap]);

  return (
    <canvas
      className={styles.canvas}
      ref={canvas}
      width={pixmap.width}
      height={pixmap.height}
      {...rest}
    />
  );
};

export default PixmapCanvas;
