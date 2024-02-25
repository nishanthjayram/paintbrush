import React, { useEffect, useRef } from "react";
import styles from "./PixmapCanvas.module.css";
import { PALETTE } from "../../constants";
import { TLayers } from "../../types";

type TProps = React.HTMLAttributes<HTMLCanvasElement> & {
  layers: TLayers;
};
const PixmapCanvas = (props: TProps) => {
  const { layers, ...rest } = props;

  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");

    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const imageData = ctx.getImageData(
      0,
      0,
      layers.main.width,
      layers.main.height
    ).data;

    for (let y = 0; y < layers.main.height; y++) {
      for (let x = 0; x < layers.main.width; x++) {
        const imageIndex = (y * layers.main.width + x) * 4;

        const mainRGB = PALETTE[layers.main.getPixel(x, y)];
        imageData[imageIndex] = mainRGB[0];
        imageData[imageIndex + 1] = mainRGB[1];
        imageData[imageIndex + 2] = mainRGB[2];
        imageData[imageIndex + 3] = 255;

        const previewPixel = layers.preview.getPixel(x, y);
        if (previewPixel > 0) {
          const previewRGB = PALETTE[previewPixel];
          imageData[imageIndex] = previewRGB[0];
          imageData[imageIndex + 1] = previewRGB[1];
          imageData[imageIndex + 2] = previewRGB[2];
          imageData[imageIndex + 3] = 255;
        }
      }
    }

    ctx.putImageData(
      new ImageData(imageData, layers.main.width, layers.main.height),
      0,
      0
    );
  }, [layers]);

  return (
    <canvas
      className={styles.canvas}
      ref={canvas}
      width={layers.main.width}
      height={layers.main.height}
      {...rest}
    />
  );
};

export default PixmapCanvas;
