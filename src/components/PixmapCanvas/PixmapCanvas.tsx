import React, { useEffect, useRef, useMemo } from "react";
import styles from "./PixmapCanvas.module.css";
import { COLOR_PALETTE } from "../../constants";
import { TLayers } from "../../types";

type TProps = React.HTMLAttributes<HTMLCanvasElement> & {
  layers: TLayers;
};
const PixmapCanvas = ({ layers, ...rest }: TProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Pre-allocate the buffer for better performance
  const imageBuffer = useMemo(() => {
    return new Uint8ClampedArray(layers.main.width * layers.main.height * 4);
  }, [layers.main.width, layers.main.height]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d", { alpha: false });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    // Single pass through pixels for both layers
    let idx = 0;
    for (let y = 0; y < layers.main.height; y++) {
      for (let x = 0; x < layers.main.width; x++) {
        const mainPixel = layers.main.getPixel([x, y]);
        const previewPixel = layers.preview.getPixel([x, y]);

        // Use preview pixel if it exists, otherwise use main pixel
        const finalPixel = previewPixel > 0 ? previewPixel : mainPixel;
        const rgb = COLOR_PALETTE[finalPixel];

        imageBuffer[idx] = rgb[0]; // R
        imageBuffer[idx + 1] = rgb[1]; // G
        imageBuffer[idx + 2] = rgb[2]; // B
        imageBuffer[idx + 3] = 255; // A

        idx += 4;
      }
    }

    ctx.putImageData(
      new ImageData(imageBuffer, layers.main.width, layers.main.height),
      0,
      0
    );
  }, [layers, imageBuffer]);

  return (
    <canvas
      className={styles.canvas}
      ref={canvasRef}
      width={layers.main.width}
      height={layers.main.height}
      {...rest}
    />
  );
};

export default PixmapCanvas;
